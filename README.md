# VeriVoice: Tamper-Proof Civic Grievance System

[![Swiss Design](https://img.shields.io/badge/UI-Swiss%20International-block)](https://en.wikipedia.org/wiki/International_Typographic_Style)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/AI_Engine-FastAPI-teal)](https://fastapi.tiangolo.com/)
[![Blockchain](https://img.shields.io/badge/Anchoring-Sepolia-blue)](https://sepolia.etherscan.io/)

A full-stack, AI-powered system designed to process civic complaints with mathematical immutability and precise classification.

**Read the full specification at `VeriVoice_Master_Build_Prompt.md` for architectural deep dives.**

## 🌍 Quick Overview

1.  **Frontend**: Next.js 14 App Router utilizing a stringent "Swiss International" design system (pure black/white, red accents, zero border radii, grid layouts).
2.  **Backend AI Engine**: Python FastAPI microservice utilizing `sentence-transformers` for geographical surge detection and Anthropic's Claude 3 for linguistic classification.
3.  **Storage Engine**: Firebase Firestore safeguarded by zero-tolerance `write-only` security rules (citizens cannot edit or delete submissions).
4.  **Immutability Layer**: Ethereum smart contract (`VeriVoice.sol`) deployed to Sepolia testnet to anchor SHA-256 state hashes, proving chronologically that records were not manipulated post-submission.
5.  **Mobile Client**: React Native + Expo dictation app enabling rapid, offline-capable field submissions.

---

## 🚀 5-Minute Local Setup Guide

Follow these steps exactly to run the local multi-repository environment.

### 1. Prerequisite Accounts
You need API keys for:
- [Firebase Console](https://console.firebase.google.com/) (Web config + Admin SDK Service Account JSON).
- [Anthropic Claude](https://console.anthropic.com/) (for NLP Categorization).
- [Infura](https://infura.io/) or Alchemy (for Sepolia Testnet RPC).
- [MetaMask](https://metamask.io/) (for deploying the smart contract).

### 2. Environment Variables
You must scaffold three separate `.env` files.

#### Web Config (`web/.env.local`)
Create `web/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_CONTRACT_ADDRESS="<Deploy step 3>"
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account"...}'
NEXT_PUBLIC_CHAIN_RPC_URL="https://sepolia.infura.io/v3/..."
VERIVOICE_PRIVATE_KEY="..."
```

#### FastAPI Config (`backend/.env`)
Create `backend/.env`:
```env
ANTHROPIC_API_KEY="sk-ant-xxx"
FIREBASE_ADMIN_KEY="path/to/service-account.json"
```

#### Blockchain Config (`blockchain/.env`)
Create `blockchain/.env`:
```env
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/..."
PRIVATE_KEY="your-metamask-private-key"
```

### 3. Deploy the Smart Contract
Anchors signatures. Ensure your MetaMask wallet has Testnet Sepolia ETH.
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
*Copy the resulting contract address to `NEXT_PUBLIC_CONTRACT_ADDRESS` in `web/.env.local`.*

### 4. Boot the Microservices

Open three terminal windows.

**Terminal 1: Web App (Next.js)**
```bash
cd web
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

**Terminal 2: AI Engine (FastAPI)**
```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*Runs on `http://localhost:8000`*

**Terminal 3: Mobile Client (Expo)**
```bash
cd mobile
npm install
npx expo start
```
*Scan the QR code with Expo Go on your phone.*

---

## 🎬 Demo Workflow

1.  **Submit Complaint:** Navigate to `http://localhost:3000`. Dictate or type a grievance (e.g., "The traffic lights on 5th avenue are totally out, causing accidents").
2.  **Verify UI Flow:** Ensure the design remains strictly brutalist (Swiss Design).
3.  **Inspect Classification:** Ensure the receipt dynamically routes it to "Department of Transportation". The backend FastAPI should calculate priority automatically.
4.  **Confirm Anchoring:** Copy the `Case ID` from the receipt page. Go to `/verify` and paste the ID. Wait for the green confirmation that the block hash matches the real-time calculated object hash.

---

## 🛡️ Security Architecture
*   **Immutability**: `web/lib/hash.ts` creates deterministic SHA-256 strings of every payload immediately.
*   **Write-only Rules**: `firestore.rules` blocks standard update/delete operations from all client apps.
*   **Rate Limiting**: Custom `middleware.ts` within the edge runs an IP-based throttle preventing DDOS on the API nodes.

---
_Concept and Architecture dictated by `VeriVoice_Master_Build_Prompt.md`._