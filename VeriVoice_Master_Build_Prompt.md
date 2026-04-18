# VeriVoice — Master Build Prompt

## For: Full-Stack AI/ML/Cybersecurity/Blockchain Demo Project

## Merge your UI/design prompt at the section marked: \[INSERT DESIGN PROMPT HERE]

\---

# ROLE \& CONTEXT

You are a senior full-stack engineer, AI/ML architect, cybersecurity specialist, and blockchain developer building **VeriVoice** — a tamper-proof, AI-powered civic grievance system. This is a fully functional demo project showcasing the intersection of AI/ML, cloud computing, and cybersecurity to solve a real societal problem: the suppression of citizen complaints by the same officials those complaints are filed against.

Every decision must optimize for:

1. Full working demo — every feature must actually function, not be mocked
2. Zero cost — free tiers only (Firebase, Vercel, Sepolia testnet, Claude API free tier, Expo Go)
3. Impressive technical depth — real blockchain, real AI, real cryptography
4. Clean, maintainable code — this will be presented to evaluators

\---

# PROJECT OVERVIEW

**VeriVoice** is a civic complaint platform where:

* Citizens file complaints via voice or text in any language
* Each complaint is SHA-256 hashed client-side and anchored to the Ethereum Sepolia blockchain via a custom Solidity smart contract
* Firebase Firestore stores complaints with write-only security rules (no edit, no delete — ever)
* AI (Claude API) auto-classifies, scores severity, detects duplicates, and supports multilingual input
* A public transparency dashboard shows all complaints, resolution rates, and department rankings
* Officials can only respond and update status — they cannot alter or delete the original complaint
* Anyone can verify any complaint in under 1 second using the hash

**The core trust guarantee**: Even if an official gains access to Firebase, they cannot alter a complaint — the original hash is anchored on a public blockchain and verifiable by anyone, forever.

\---

# TECH STACK — ALL FREE TIER

|Layer|Technology|Purpose|
|-|-|-|
|Web frontend|Next.js 14 + Tailwind CSS|6-screen citizen/official web app|
|Mobile|React Native + Expo|iOS/Android citizen app|
|Database|Firebase Firestore|Complaint storage, write-only rules|
|Auth|Firebase Auth|Official login only|
|Notifications|Firebase Cloud Messaging (FCM)|Push alerts on status change|
|Hashing|Web Crypto API (built-in browser)|SHA-256, client-side, before upload|
|Blockchain|Ethereum Sepolia Testnet|Hash anchoring, permanent public record|
|Smart contract|Solidity|Stores hash + complaint ID + timestamp|
|Contract tools|Hardhat + ethers.js|Compile, deploy, interact|
|AI / NLP|Claude API (claude-sonnet-4-20250514)|Classify, severity, multilingual, summarise|
|Voice (web)|Web Speech API|Browser voice recording, no API key|
|Voice (mobile)|Expo Audio|Mobile voice recording|
|Transcription|OpenAI Whisper API|Audio file transcription|
|AI backend|FastAPI (Python)|Embeddings, duplicate detection, analytics|
|Embeddings|sentence-transformers (all-MiniLM-L6-v2)|Duplicate complaint grouping|
|Maps|Leaflet.js|Complaint map with clustering|
|Charts|Chart.js|Analytics dashboard|
|QR codes|qrcode.js|Receipt QR generation|
|PDF receipts|jsPDF|Downloadable complaint receipts|
|Hosting (web)|Vercel|Free deployment|
|Hosting (mobile)|Expo Go|Demo on physical device|
|Rate limiting|Cloudflare Workers (free tier)|Spam prevention without login|

\---

# MONOREPO FOLDER STRUCTURE

Build the entire project as a monorepo with this exact structure:

```
verivoice/
├── README.md
├── .env.example                          # All environment variable keys (no values)
├── .gitignore
│
├── blockchain/                           # Solidity smart contract
│   ├── contracts/
│   │   └── VeriVoice.sol                 # Main complaint hash contract
│   ├── scripts/
│   │   └── deploy.js                     # Hardhat deploy script
│   ├── test/
│   │   └── VeriVoice.test.js
│   ├── hardhat.config.js
│   └── package.json
│
├── backend/                              # FastAPI Python backend (AI/ML layer)
│   ├── main.py                           # FastAPI app entry point
│   ├── routes/
│   │   ├── classify.py                   # Claude API classification endpoint
│   │   ├── embeddings.py                 # Duplicate detection endpoint
│   │   └── analytics.py                  # Department scoring, surge detection
│   ├── services/
│   │   ├── claude\_service.py             # Claude API wrapper
│   │   ├── embedding\_service.py          # sentence-transformers wrapper
│   │   └── firebase\_service.py           # Firebase Admin SDK
│   ├── requirements.txt
│   └── .env.example
│
├── web/                                  # Next.js 14 web application
│   ├── app/
│   │   ├── page.tsx                      # Home — file a complaint
│   │   ├── receipt/\[id]/page.tsx         # Receipt + QR code page
│   │   ├── verify/page.tsx               # Verify complaint by ID or hash
│   │   ├── dashboard/page.tsx            # Public transparency dashboard
│   │   ├── official/
│   │   │   ├── login/page.tsx            # Official login
│   │   │   └── portal/page.tsx           # Official response portal
│   │   └── analytics/page.tsx            # Department rankings + charts
│   ├── components/
│   │   ├── ComplaintForm.tsx             # Voice + text complaint form
│   │   ├── HashReceipt.tsx               # QR + hash display
│   │   ├── VerifyEngine.tsx              # Hash comparison component
│   │   ├── ComplaintCard.tsx             # Single complaint display
│   │   ├── ComplaintMap.tsx              # Leaflet map
│   │   ├── DepartmentChart.tsx           # Chart.js analytics
│   │   └── StatusBadge.tsx              # Pending/Resolved/etc badge
│   ├── lib/
│   │   ├── hash.ts                       # SHA-256 Web Crypto wrapper
│   │   ├── blockchain.ts                 # ethers.js contract interaction
│   │   ├── firebase.ts                   # Firebase client config
│   │   ├── claude.ts                     # Claude API client
│   │   └── types.ts                      # Shared TypeScript types
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── mobile/                               # React Native Expo app
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx                 # File complaint tab
│   │   │   ├── my-complaints.tsx         # My complaints + status
│   │   │   ├── map.tsx                   # Nearby complaints map
│   │   │   └── scan.tsx                  # QR scanner verify
│   │   └── \_layout.tsx
│   ├── components/
│   │   ├── VoiceRecorder.tsx             # Expo Audio voice recorder
│   │   ├── OfflineQueue.tsx              # Queue complaints when offline
│   │   ├── ComplaintCard.tsx             # Mobile complaint card
│   │   └── PushNotificationSetup.tsx     # FCM setup
│   ├── services/
│   │   ├── api.ts                        # API calls to web/backend
│   │   ├── storage.ts                    # AsyncStorage for offline queue
│   │   └── notifications.ts             # Push notification handler
│   ├── app.json
│   └── package.json
│
└── shared/                               # Shared types and constants
    ├── types.ts
    └── constants.ts
```

\---

# MODULE 01 — BLOCKCHAIN SMART CONTRACT

## File: `blockchain/contracts/VeriVoice.sol`

Write a Solidity smart contract with the following exact specification:

```
SPDX-License-Identifier: MIT
Solidity version: ^0.8.19

Contract name: VeriVoice

State:
- A struct ComplaintRecord containing:
    - string complaintId       (unique ID from Firebase)
    - string hash              (SHA-256 hash of complaint text)
    - uint256 timestamp        (block.timestamp at submission)
    - address submittedBy      (wallet that submitted — will be the backend wallet)

- mapping(string => ComplaintRecord) private complaints
  (key: complaintId)

- mapping(string => bool) private complaintExists
  (key: complaintId — prevents duplicate anchoring)

- uint256 public totalComplaints

Events:
- event ComplaintAnchored(string indexed complaintId, string hash, uint256 timestamp)

Functions:
1. anchorComplaint(string calldata complaintId, string calldata hash)
   - external
   - Requires: complaintExists\[complaintId] == false
   - Requires: bytes(hash).length == 64 (valid SHA-256 hex string)
   - Stores the ComplaintRecord
   - Emits ComplaintAnchored
   - Increments totalComplaints

2. getComplaint(string calldata complaintId)
   - external view
   - Returns: (string hash, uint256 timestamp, address submittedBy)
   - Requires complaint exists

3. verifyHash(string calldata complaintId, string calldata hash)
   - external view
   - Returns: bool (true if hash matches stored hash)
   - This is the core verification function

4. complaintAnchored(string calldata complaintId)
   - external view
   - Returns: bool (whether this complaintId has been anchored)
```

## File: `blockchain/hardhat.config.js`

Configure Hardhat for:

* Solidity 0.8.19
* Network: sepolia with url from `SEPOLIA\_RPC\_URL` env var and accounts from `DEPLOYER\_PRIVATE\_KEY` env var
* Use @nomicfoundation/hardhat-toolbox

## File: `blockchain/scripts/deploy.js`

Deployment script that:

1. Deploys VeriVoice contract to Sepolia
2. Logs the deployed contract address
3. Saves the contract address and ABI to `web/lib/contract.json` automatically

\---

# MODULE 02 — FIREBASE SETUP

## Firestore Security Rules

Write Firebase security rules with these exact constraints:

```
COMPLAINTS collection:
- Anyone can READ any document (public transparency)
- Anyone can CREATE a document IF:
    - All required fields present: id, text, hash, category, severity, status, timestamp, location
    - status field == "pending" (only pending on creation)
    - hash field is a non-empty string
    - text field is a non-empty string, max 2000 chars
- NOBODY can UPDATE the following fields ever: text, hash, id, timestamp
- Officials (users with email verified) can UPDATE only: status, officialResponse, resolvedAt
- NOBODY can DELETE any complaint document — ever

AUDIT\_LOGS collection:
- Admins only can read
- Cloud Functions only can write (no client writes)

OFFICIALS collection:
- Only the official themselves can read their own document
- No client writes (managed via Cloud Functions)
```

## Firestore Indexes

Create composite indexes for:

1. complaints: category ASC + timestamp DESC
2. complaints: status ASC + timestamp DESC
3. complaints: severity DESC + timestamp DESC
4. complaints: category ASC + status ASC + timestamp DESC

## Firebase Cloud Functions

Write these Cloud Functions (Node.js):

1. `onComplaintCreated` — triggers on new complaint document:

   * Calls the FastAPI backend to classify the complaint
   * Updates the complaint document with AI-generated category, severity, department
   * Sends push notification to subscribed officials of that department
2. `onStatusUpdated` — triggers on complaint status field change:

   * Writes an entry to AUDIT\_LOGS collection
   * Sends push notification to the complaint's submitterToken (if provided)
3. `scheduleNightlyVerification` — runs nightly via Cloud Scheduler:

   * Fetches all complaints from last 30 days
   * Re-hashes stored text and compares with stored hash
   * If any mismatch found: flags the complaint with tampered: true, sends alert email to admin

\---

# MODULE 03 — HASHING + BLOCKCHAIN INTEGRATION

## File: `web/lib/hash.ts`

```typescript
// SHA-256 hashing using Web Crypto API — runs entirely in browser
// No library needed, built into every modern browser

export async function sha256(text: string): Promise<string>
// Returns hex string of SHA-256 hash

export async function verifyHash(text: string, expectedHash: string): Promise<boolean>
// Returns true if sha256(text) === expectedHash

export function generateComplaintId(): string
// Returns a unique ID: "VV-" + timestamp + "-" + 6 random chars
// Example: "VV-1704067200000-x7k9m2"
```

## File: `web/lib/blockchain.ts`

```typescript
// ethers.js interaction with deployed VeriVoice contract
// Uses a backend wallet (not user's wallet) — citizens don't need MetaMask

export async function anchorToBlockchain(
  complaintId: string,
  hash: string
): Promise<{ txHash: string; blockNumber: number }>
// Calls contract.anchorComplaint() using backend wallet
// Returns transaction hash and block number

export async function verifyOnChain(
  complaintId: string,
  hash: string
): Promise<boolean>
// Calls contract.verifyHash() — read-only, no gas needed

export async function getChainRecord(complaintId: string): Promise<{
  hash: string;
  timestamp: number;
  txHash: string;
} | null>
// Returns the on-chain record for a complaint ID

export function getEtherscanLink(txHash: string): string
// Returns Sepolia Etherscan URL for a transaction
// https://sepolia.etherscan.io/tx/{txHash}
```

**Important implementation note**: The `anchorToBlockchain` function must be called from a Next.js API route (server-side), never from client-side code, because it uses the deployer private key. The private key must never be exposed to the browser.

\---

# MODULE 04 — COMPLAINT SUBMISSION FLOW

## File: `web/app/api/complaints/submit/route.ts`

This is the most critical API endpoint. It must:

1. Receive: `{ text, voiceTranscript, location, submitterToken? }`
2. Generate a unique complaintId using `generateComplaintId()`
3. Compute SHA-256 hash of the complaint text using `sha256(text)`
4. Call Claude API to classify the complaint:

```
   Prompt: "Classify this civic complaint. Return JSON only:
   {
     category: one of \[Road, Water, Electricity, Sanitation, Corruption, Healthcare, Education, Other],
     severity: integer 1-5 (5 = most urgent),
     department: string (which government department should handle this),
     summary: string (one sentence summary in English regardless of input language),
     language: string (detected language of the complaint)
   }
   Complaint: {text}"
   ```

5. Store in Firestore with fields:

```
   id, text, hash, category, severity, department, summary, language,
   status: "pending", timestamp: serverTimestamp(),
   location: { lat, lng, address },
   blockchainTx: null,  // filled after step 6
   blockchainBlock: null,
   submitterToken: (hashed if provided, never plain),
   tampered: false
   ```

6. Anchor hash to blockchain via `anchorToBlockchain(complaintId, hash)`
7. Update Firestore document with blockchainTx and blockchainBlock
8. Return: `{ complaintId, hash, blockchainTx, etherscanLink, timestamp }`

**Error handling**: If blockchain anchoring fails (network issue), still save to Firebase and queue the anchoring for retry. Never lose a complaint because of a blockchain timeout.

\---

# MODULE 05 — WEB APP SCREENS

\[<role>

You are an expert frontend engineer, UI/UX designer, visual design specialist, and typography expert. Your goal is to help the user integrate a design system into an existing codebase in a way that is visually consistent, maintainable, and idiomatic to their tech stack.



Before proposing or writing any code, first build a clear mental model of the current system:

\- Identify the tech stack (e.g. React, Next.js, Vue, Tailwind, shadcn/ui, etc.).

\- Understand the existing design tokens (colors, spacing, typography, radii, shadows), global styles, and utility patterns.

\- Review the current component architecture (atoms/molecules/organisms, layout primitives, etc.) and naming conventions.

\- Note any constraints (legacy CSS, design library in use, performance or bundle-size considerations).



Ask the user focused questions to understand the user's goals. Do they want:

\- a specific component or page redesigned in the new style,

\- existing components refactored to the new system, or

\- new pages/features built entirely in the new style?



Once you understand the context and scope, do the following:

\- Propose a concise implementation plan that follows best practices, prioritizing:

&#x20; - centralizing design tokens,

&#x20; - reusability and composability of components,

&#x20; - minimizing duplication and one-off styles,

&#x20; - long-term maintainability and clear naming.

\- When writing code, match the user’s existing patterns (folder structure, naming, styling approach, and component patterns).

\- Explain your reasoning briefly as you go, so the user understands \*why\* you’re making certain architectural or design choices.



Always aim to:

\- Preserve or improve accessibility.

\- Maintain visual consistency with the provided design system.

\- Leave the codebase in a cleaner, more coherent state than you found it.

\- Ensure layouts are responsive and usable across devices.

\- Make deliberate, creative design choices (layout, motion, interaction details, and typography) that express the design system’s personality instead of producing a generic or boilerplate UI.



</role>



<design-system>

\# Design Style: Swiss International (International Typographic Style)



\## Design Philosophy



\*\*The International Typographic Style (Swiss Style)\*\* is not merely a visual trend; it is a philosophy of objective communication born in 1950s Switzerland. It rejects personal expression and subjectivity in favor of universal clarity, mathematical precision, and logical structure.



\*\*Core Tenets:\*\*



1\.  \*\*Objectivity over Subjectivity\*\*: The design must recede to let the content speak. Every visual decision must be justifiable by the content's needs. Personal ornamentation is eliminated in favor of functional communication. The designer is not an artist expressing themselves, but a conduit for information.



2\.  \*\*The Grid as Law\*\*: The grid is the absolute authority. It is not a guideline; it is the visible skeleton of the information. We generally avoid static center-alignment in favor of \*\*asymmetrical organization\*\* to create dynamic visual rhythm and tension. Grid patterns are made visible through subtle background textures.



3\.  \*\*Typography is the Interface\*\*: Type is not just for reading; it is the primary structural and graphical element. We use grotesque sans-serif typefaces (Inter, Helvetica) because they are neutral vessels for meaning. Scale, weight, and position are the only tools needed to create hierarchy.



4\.  \*\*Active Negative Space\*\*: White space is not "empty"; it is an active structural element. It defines boundaries, gives weight to the massive typography, and creates breathing room for the intellect.



5\.  \*\*Layered Texture \& Depth\*\*: While maintaining flatness (no shadows or 3D effects), we achieve visual depth through \*\*subtle pattern overlays\*\*: grid lines (24px), dot matrices (16px), diagonal stripes, and noise textures. These patterns add tactile richness without compromising the objective aesthetic.



6\.  \*\*Universal Intelligibility\*\*: The design should be understood instantly. It is clean, legible, and undeniably modern.



\*\*The Vibe\*\*:

\*   \*\*Intellectual \& Architectural\*\*: The page should feel like a well-engineered building, a museum exhibition, or a transit map—functional, safe, and efficient.

\*   \*\*Structured yet Organic\*\*: While brutally honest in its geometry, subtle texture patterns provide warmth and visual interest—like fine paper grain or screen printing texture.

\*   \*\*Brutally Precise\*\*: No gradients to hide bad layout. Depth comes from pattern, not shadow. The design is flat yet rich, stark yet nuanced.

\*   \*\*Timeless\*\*: By avoiding ephemeral trends (glassmorphism, neumorphism, soft rounded corners), the design aims for permanence.



\*\*Visual Signatures\*\*:

\*   \*\*Flush-Left, Ragged-Right Text\*\*: Text blocks are strictly left-aligned to the grid.

\*   \*\*Grotesque Sans-Serif\*\*: Neutral, objective fonts with high x-heights (Inter, weight 400-900).

\*   \*\*Mathematical Scales\*\*: Font sizes that relate to each other through clear ratios (responsive scaling from mobile to desktop).

\*   \*\*The "Swiss Red" (#FF3000)\*\*: Used not as decoration, but as a functional signal—a stop sign, a warning, a highlight—piercing the monochrome calm.

\*   \*\*Pattern-Based Texture\*\*: Subtle CSS-generated patterns (grid, dots, diagonals, noise) applied to background surfaces for visual depth without breaking flatness.

\*   \*\*Geometric Abstraction\*\*: Basic shapes (circles, squares, rectangles, lines) arranged in Bauhaus-inspired compositions.



\## Design Token System (The DNA)



\### Colors (Strict Palette)

\*   \*\*Background\*\*: `#FFFFFF` (Pure White) - The canvas must be neutral.

\*   \*\*Foreground\*\*: `#000000` (Pure Black) - Text is absolute.

\*   \*\*Muted\*\*: `#F2F2F2` (Light Gray) - Used for secondary backgrounds to create rhythm.

\*   \*\*Accent\*\*: `#FF3000` (Swiss Red) - The \*\*only\*\* signal color. Used sparingly for CTAs and critical emphasis.

\*   \*\*Border\*\*: `#000000` (Pure Black) - Structure is visible.



\### Typography

\*   \*\*Font Family\*\*: `Inter` (Google Font). Ideally closest to Helvetica/Akzidenz-Grotesk.

\*   \*\*Weights\*\*: Heavy use of \*\*Black (900)\*\* and \*\*Bold (700)\*\* for headings. \*\*Regular (400)\*\* or \*\*Medium (500)\*\* for body.

\*   \*\*Style\*\*: \*\*UPPERCASE\*\* for almost all headings and labels.

\*   \*\*Tracking\*\*: `tracking-tighter` for large headlines, `tracking-widest` for small labels.

\*   \*\*Scale\*\*: Extreme contrast. Headlines should be massive (`text-7xl` to `text-9xl`+). Body text is legible and objective.



\### Radius \& Border

\*   \*\*Radius\*\*: `0px` (Strictly Rectangular). No rounded corners.

\*   \*\*Borders\*\*: Thick, visible borders (`border-2` or `border-4`). Used to define the grid.



\### Shadows \& Effects

\*   \*\*Shadows\*\*: No drop shadows. The design maintains flatness. Only use subtle ring shadows for compositional geometry (e.g., `shadow-\[0\_0\_0\_8px\_rgba(255,48,0,0.1)]` for accent circles).

\*   \*\*Effects\*\*: Interactive elements use simple color inversion (Black → White, White → Red), scale transforms (1.0 → 1.05), rotation (0deg → 90deg for plus icons), and vertical translation (-1px lift on hover).



\### Textures \& Patterns (Critical for Depth)

These CSS-based patterns add visual richness while maintaining the flat, objective aesthetic:



\*   \*\*Grid Pattern\*\* (`.swiss-grid-pattern`):

&#x20;   - Subtle 24×24px grid lines at 3% opacity

&#x20;   - Applied to hero composition area, blog sidebar, muted backgrounds

&#x20;   - Creates visible structure without overwhelming content



\*   \*\*Dot Matrix\*\* (`.swiss-dots`):

&#x20;   - Radial gradient dots, 16×16px spacing, 4% opacity

&#x20;   - Applied to section headers, feature sidebars

&#x20;   - Evokes traditional print techniques



\*   \*\*Diagonal Lines\*\* (`.swiss-diagonal`):

&#x20;   - 45-degree repeating lines, 10px spacing, 2% opacity

&#x20;   - Applied to benefits sidebar, accent backgrounds

&#x20;   - Adds directional energy to static layouts



\*   \*\*Noise Texture\*\* (`.swiss-noise`):

&#x20;   - Fractal noise overlay via SVG filter, 1.5% opacity

&#x20;   - Applied globally to body background

&#x20;   - Simulates paper texture, adds warmth to stark white backgrounds



\*\*Application Strategy\*\*: Use patterns on muted gray backgrounds (`#F2F2F2`) and occasionally on white surfaces. Never apply patterns to pure black backgrounds or red accent areas. Patterns should enhance, not dominate.



\## Component Stylings



\### Buttons

\*   \*\*Shape\*\*: Strictly rectangular (`rounded-none`).

\*   \*\*Style\*\*: Solid Black background with White text (Primary). White background with Black border (Secondary).

\*   \*\*Hover\*\*: Invert colors or switch to Swiss Red (`#FF3000`).

\*   \*\*Typography\*\*: Uppercase, bold, tracking-wide.



\### Cards / Containers

\*   \*\*Structure\*\*: Defined by their borders (`border-black`).

\*   \*\*Background\*\*: White or Muted Gray (`#F2F2F2`).

\*   \*\*Padding\*\*: Generous and uniform (`p-8`, `p-12`).

\*   \*\*Hover\*\*: Entire card background changes color (e.g., to Swiss Red or Black) with text color inversion.



\### Inputs

\*   \*\*Style\*\*: Underlined (`border-b`) or solid rectangular box with thick border.

\*   \*\*Focus\*\*: Sharp change in border color to Swiss Red. No glow rings.



\## Layout Strategy



\*   \*\*The Grid\*\*: The grid is God. It should often be \*\*visible\*\* (using borders on elements).

\*   \*\*Asymmetry\*\*: Embrace asymmetrical balance. A large photo on the left balanced by negative space and small text on the right.

\*   \*\*Alignment\*\*: Strict left alignment for text.

\*   \*\*Separators\*\*: Use horizontal and vertical lines to divide sections.



\## Non-Genericness (The "Bold" Factor)



This implementation goes beyond "generic Swiss style" by incorporating:



\*   \*\*Massive Responsive Typography\*\*: Headlines scale from `text-6xl` (mobile) to `text-\[10rem]` (desktop). Let words be images.

\*   \*\*Visible Structure\*\*: The layout grid is made tangible through:

&#x20;   - Thick 4px black borders defining sections

&#x20;   - Visible grid patterns (24px) on backgrounds

&#x20;   - Asymmetric column ratios (8:4, 7:5, 5:7) creating dynamic tension

\*   \*\*Numbered Section Labels\*\*: Every major section has a prefix (01. System, 02. Method, 03. Advantages, 04. Journal) in red accent with uppercase tracking

\*   \*\*Layered Geometric Compositions\*\*:

&#x20;   - Hero features abstract Bauhaus-style composition with overlapping shapes

&#x20;   - Product detail uses 2×2 grid of geometric elements with different texture patterns

&#x20;   - Each composition combines circles, rectangles, lines in purposeful arrangement

\*   \*\*Pattern-Based Texture\*\*: Four distinct CSS patterns (grid, dots, diagonal, noise) applied strategically to create depth without shadows

\*   \*\*Bold Interaction States\*\*:

&#x20;   - Full color inversions (not just opacity fades)

&#x20;   - Rotating icons (plus signs spin 90°)

&#x20;   - Scale transforms on hover

&#x20;   - Vertical slide animations in navigation

\*   \*\*Active Negative Space\*\*: Generous padding (p-12, p-24) and asymmetric layouts create breathing room and visual tension

\*   \*\*Functional Color System\*\*: Red is used only for:

&#x20;   - Primary CTAs and accents

&#x20;   - Hover states as visual feedback

&#x20;   - Section number prefixes

&#x20;   - Never as decorative fill



\## Spacing \& Iconography



\*   \*\*Spacing\*\*: High density in information clusters (tables), but high spaciousness in narrative sections.

\*   \*\*Iconography\*\*: Use `lucide-react` icons, but treat them as functional symbols. Stroke width should match typography. Often enclosed in geometric shapes (squares/circles).



\## Animation



\*   \*\*Feel\*\*: Instant, mechanical, snappy, precise. Movement is purposeful and geometric.

\*   \*\*Transitions\*\*: `duration-200 ease-out` or `duration-150 ease-linear` for rapid feedback. No elastic or spring animations.

\*   \*\*Micro-interactions\*\*:

&#x20;   - \*\*Navigation Links\*\*: Vertical slide animation with color change (text slides up, red replacement slides in from below)

&#x20;   - \*\*Stats Cards\*\*: Scale transform on numbers (1.0 → 1.05), rotating plus icons (0° → 90°), background color snap (black → red)

&#x20;   - \*\*Feature Cards\*\*: Color inversion on hover (white → accent red), arrow rotation (-45° → 0°)

&#x20;   - \*\*Testimonials\*\*: Subtle upward lift (-1px translateY), border color change (black → red), quote text color change

&#x20;   - \*\*FAQ Cards\*\*: Rotating plus icons, full background color inversion (white → red)

&#x20;   - \*\*Buttons\*\*: Instant background color changes, no scale transforms

\*   \*\*Hover States\*\*: Always indicate interactivity through color, scale, or position changes—never subtle fades. Swiss style is bold and immediate.



\## Responsive Strategy



The Swiss style must maintain its bold character across all screen sizes:



\*\*Mobile (< 768px)\*\*:

\*   Typography scales down but remains bold: `text-6xl` for hero headlines

\*   Single column layouts with vertical stacking

\*   Borders remain 4px thick (never thin out)

\*   CTAs become full-width buttons with consistent height (`h-16`)

\*   Grid patterns and textures maintain same opacity/scale

\*   Stats become 2×2 grid instead of 1×4

\*   Navigation collapses (visible only on desktop)



\*\*Tablet (768px - 1024px)\*\*:

\*   Two-column layouts for testimonials, FAQ, features

\*   Typography scales to `text-8xl` for headlines

\*   Asymmetric grids start to appear

\*   Touch targets remain minimum 44×44px



\*\*Desktop (1024px+)\*\*:

\*   Full asymmetric grid layouts (8:4, 7:5, 5:7 ratios)

\*   Maximum typography scale (`text-9xl`, `text-\[10rem]`)

\*   Multi-column layouts (3-4 columns for blog, footer)

\*   Sticky positioning for section headers

\*   All hover states and micro-interactions active



\*\*Key Principles\*\*:

\- Never compromise on border thickness or contrast

\- Maintain uppercase typography and tight tracking

\- Patterns remain visible at all breakpoints

\- Red accent color used consistently across devices

\- Spacing remains generous (reduce from p-24 to p-12 on mobile, but never less)



\## Accessibility



\*   \*\*Contrast\*\*: The Black/White/Red scheme naturally offers ultra-high contrast (21:1 for black/white). Ensure red text on white meets AA standards.

\*   \*\*Focus\*\*: High-contrast 2px ring in red (`focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2`)

\*   \*\*Touch Targets\*\*: All interactive elements minimum 44×44px on mobile

\*   \*\*Motion\*\*: All animations are CSS-based and respect `prefers-reduced-motion`

\*   \*\*Semantics\*\*: Proper heading hierarchy, semantic HTML5 elements, ARIA labels where needed

</design-system>]

The following screens must be built. Apply your design system to all of them:

## Screen 1: Home — File a Complaint (`app/page.tsx`)

Must include:

* Hero section explaining what VeriVoice does and why complaints are tamper-proof
* Complaint form with:

  * Large textarea for complaint text (2000 char limit with counter)
  * Voice recording button using Web Speech API — shows live transcript as user speaks
  * Category dropdown (pre-filled by AI after submission, also manually selectable)
  * Location input — browser geolocation button + manual text entry
  * Anonymous badge — "Your identity is never stored"
* Submit button that shows loading state through the full pipeline:

  * "Hashing your complaint..."
  * "Storing securely..."
  * "Anchoring to blockchain..."
  * "Done — receipt ready"
* No login required to submit

## Screen 2: Receipt Page (`app/receipt/\[id]/page.tsx`)

Must include:

* Large success visual
* Complaint ID prominently displayed (e.g. VV-1704067200000-x7k9m2)
* SHA-256 hash displayed in monospace font (full 64 chars)
* Blockchain transaction ID with clickable Etherscan link
* Block number and timestamp
* QR code that encodes the verify URL for this complaint
* Download PDF receipt button (jsPDF)
* "Share receipt" button (Web Share API)
* Explanation: "What does this mean?" expandable section explaining tamper-proof guarantee
* AI-generated summary of their complaint + assigned category + severity badge

## Screen 3: Verify Complaint (`app/verify/page.tsx`)

Must include:

* Two verification methods:

  1. Enter Complaint ID — fetches from Firebase, re-hashes text, compares with stored hash AND checks blockchain
  2. Paste Hash directly — compares with blockchain record
* Verification result shows:

  * VERIFIED green state: "This complaint is authentic and has not been altered"
  * Shows original hash, blockchain tx, timestamp, Etherscan link
  * TAMPERED red state: "Warning: this complaint's content does not match the blockchain record"
  * PENDING amber state: "Blockchain anchoring in progress"
* Timeline showing: Filed → Hashed → Anchored → Verified

## Screen 4: Public Dashboard (`app/dashboard/page.tsx`)

Must include:

* Real-time stats row: Total Complaints, Resolved %, Avg Response Time, Active Departments
* Filter bar: Category, Status, Severity, Date range, Department, Search
* Complaint feed (Firestore real-time listener):

  * Each card shows: ID, summary, category badge, severity indicator, status badge, timestamp, blockchain verified checkmark
  * Click to expand full complaint text + blockchain proof
* Leaflet map tab — pins clustered by severity colour (red=5, orange=4, yellow=3, green=1-2)
* No login required — fully public

## Screen 5: Official Portal (`app/official/portal/page.tsx`)

Must include:

* Login gate (Firebase Auth — email/password)
* Inbox of complaints assigned to this official's department
* Each complaint shows: full text (read-only), original hash, current status, history
* Response form: official can add a response text and update status to In Review / Resolved / Rejected
* The original complaint text field must be visually locked — show a padlock icon and "Immutable — protected by blockchain"
* Audit trail: shows every status change with timestamp and who made it
* The official CANNOT delete any complaint — no delete button exists anywhere

## Screen 6: Analytics (`app/analytics/page.tsx`)

Must include:

* Department performance table: Resolution Rate %, Avg Response Time, Total Complaints, Pending Count
* Colour-coded ranking (green = good, red = poor)
* Chart.js charts:

  * Complaints over time (line chart, last 30 days)
  * Breakdown by category (doughnut chart)
  * Resolution rate by department (bar chart)
  * Severity distribution (stacked bar)
* Complaint surge detector: if a locality has 3x normal volume in 24 hours, show a highlighted alert card

\---

# MODULE 06 — MOBILE APP

## Voice Recording (`mobile/components/VoiceRecorder.tsx`)

* Expo Audio API to record voice
* Show waveform animation while recording (animated bars, CSS-based)
* On stop: send audio blob to `/api/transcribe` which calls Whisper API
* Show transcribed text for user to confirm before submitting
* Handle permissions gracefully — explain why microphone access is needed

## Offline Queue (`mobile/services/storage.ts` + `mobile/components/OfflineQueue.tsx`)

* Use AsyncStorage to store complaints locally when offline
* NetInfo to detect connectivity
* When offline: show "Saved locally — will submit when connected" banner
* When back online: auto-submit all queued complaints in order
* Show queue count badge on the file tab

## QR Scanner (`mobile/app/(tabs)/scan.tsx`)

* expo-barcode-scanner to scan QR receipts
* Decodes the complaint verify URL
* Shows instant verification result with same logic as web verify screen

## Push Notifications (`mobile/services/notifications.ts`)

* Expo Notifications + Firebase FCM
* On app first open: request permission and register token
* Send token with complaint submission (hashed for privacy)
* Handle notification tap: navigate to the specific complaint

\---

# MODULE 07 — AI / ML BACKEND

## File: `backend/routes/classify.py`

POST `/classify`

* Input: `{ complaintId, text, language? }`
* Calls Claude API with structured prompt
* Returns: `{ category, severity, department, summary, language, keywords\[] }`

## File: `backend/routes/embeddings.py`

POST `/find-duplicates`

* Input: `{ complaintId, text, topK: 5 }`
* Generates embedding using sentence-transformers all-MiniLM-L6-v2
* Compares against embeddings of last 500 complaints (stored in Firestore)
* Returns: `{ duplicates: \[{ complaintId, similarity, summary }] }`
* If any duplicate has similarity > 0.85, the new complaint gets grouped with it

POST `/embed`

* Input: `{ complaintId, text }`
* Generates and stores embedding vector for this complaint

## File: `backend/routes/analytics.py`

GET `/department-scores`

* Queries Firestore for all complaints
* Calculates per department: total, resolved, pending, avg\_resolution\_hours
* Returns ranked list with scores

GET `/surge-detection`

* Groups complaints by locality + 24hr windows
* Returns localities where complaint volume is 3x higher than the 7-day average
* Used by dashboard to show surge alerts

\---

# MODULE 08 — SECURITY HARDENING

## Rate Limiting

In Next.js middleware (`web/middleware.ts`):

* Track submission attempts by IP using a simple in-memory Map (sufficient for demo)
* Max 5 complaint submissions per IP per hour
* Return 429 with retry-after header when exceeded
* Show friendly "Please wait before submitting another complaint" message

## Input Validation

In the submission API route, validate:

* Text: min 20 chars, max 2000 chars, no HTML/script tags (sanitise with DOMPurify)
* Location: valid lat/lng ranges if provided
* File uploads (voice): max 10MB, audio MIME types only

## Security Headers

In `next.config.ts`, add headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval'; connect-src 'self' \*.googleapis.com \*.firebaseio.com sepolia.infura.io
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), microphone=(self)
```

## Audit Logging

Every official action (login, status change, response posted) must write to an AUDIT\_LOGS Firestore collection with:

* `action`: string
* `officialId`: string
* `complaintId`: string
* `previousValue`: any
* `newValue`: any
* `timestamp`: serverTimestamp()
* `ipAddress`: string (from request headers)

\---

# MODULE 09 — ENVIRONMENT VARIABLES

## `web/.env.local` keys needed:

```
NEXT\_PUBLIC\_FIREBASE\_API\_KEY=
NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN=
NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID=
NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET=
NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID=
NEXT\_PUBLIC\_FIREBASE\_APP\_ID=
NEXT\_PUBLIC\_CONTRACT\_ADDRESS=
NEXT\_PUBLIC\_SEPOLIA\_CHAIN\_ID=11155111

# Server-side only — never exposed to browser
SEPOLIA\_RPC\_URL=
DEPLOYER\_PRIVATE\_KEY=
CLAUDE\_API\_KEY=
OPENAI\_API\_KEY=
FIREBASE\_ADMIN\_KEY=
BACKEND\_URL=
```

## `blockchain/.env` keys needed:

```
SEPOLIA\_RPC\_URL=
DEPLOYER\_PRIVATE\_KEY=
ETHERSCAN\_API\_KEY=
```

## Free service signup instructions (include in README):

1. Firebase — firebase.google.com — free Spark plan
2. Sepolia RPC — Infura.io free tier OR Alchemy.com free tier (100M requests/month)
3. Sepolia test ETH — sepoliafaucet.com (free test ETH for gas)
4. Claude API — console.anthropic.com — free tier available
5. OpenAI Whisper — platform.openai.com — pay-per-use, \~$0.006/min audio
6. Vercel — vercel.com — free hobby plan

\---

# MODULE 10 — DEMO SCRIPT (What to show evaluators)

Build a dedicated demo mode. When `NEXT\_PUBLIC\_DEMO\_MODE=true`:

* Pre-populate 20 realistic complaints across different categories and departments
* Some complaints marked resolved, some pending, some in review
* One complaint marked as "surge detected" in its locality
* Two complaints grouped as duplicates

## The 5-minute demo flow (document this in README):

1. **File a complaint** (90 seconds)

   * Open the web app, show the home screen
   * Click "Record Voice" — speak a complaint in Hindi or English
   * Show live transcription appearing
   * Submit — show the 3-step progress: Hashing → Storing → Anchoring to blockchain
   * Receipt page appears with hash + Etherscan link
2. **Prove tamper-proof** (60 seconds)

   * Click the Etherscan link — show the hash sitting on the real Sepolia blockchain
   * Go to Verify screen — paste the complaint ID
   * Show the green VERIFIED result
   * Explain: "Even if someone hacks our database and changes the text, this verification will fail"
3. **Show the public dashboard** (60 seconds)

   * Switch to Dashboard tab
   * Show the complaint just filed appearing in real-time
   * Show the map with complaint pins
   * Show the department rankings — point out which departments are failing
4. **Official response** (60 seconds)

   * Log in as an official (use demo credentials)
   * Show the complaint in the official portal
   * Point out the padlock on the complaint text — "cannot be altered"
   * Post a response and change status to "In Review"
   * Switch back to the public dashboard — show it updated in real-time
5. **AI intelligence** (30 seconds)

   * Show the analytics page
   * Point out the surge alert card
   * Show duplicate complaints grouped together
   * Show department performance chart

\---

# IMPLEMENTATION INSTRUCTIONS

## Code quality requirements:

* TypeScript strict mode throughout the web app
* All async operations wrapped in try/catch with meaningful error messages
* Loading states for every async operation — no blank screens
* Error boundaries in React to catch and display errors gracefully
* All forms have client-side validation before submission
* Mobile app handles permission denials gracefully with explanatory modals

## What to build first (exact order):

**Step 1** — `blockchain/` folder complete:
Write VeriVoice.sol, hardhat.config.js, deploy.js. Deploy to Sepolia. Save contract address.

**Step 2** — Firebase setup:
Firestore security rules, composite indexes, Cloud Functions stubs.

**Step 3** — `web/lib/` utilities:
hash.ts, blockchain.ts, firebase.ts, types.ts — the foundation everything else calls.

**Step 4** — Complaint submission API:
`app/api/complaints/submit/route.ts` — the full pipeline working end-to-end.

**Step 5** — Claude classification:
`backend/routes/classify.py` + `web/lib/claude.ts` — AI layer.

**Step 6** — Web screens 1–4 (public-facing):
Home, Receipt, Verify, Dashboard — citizens can file and verify.

**Step 7** — Web screens 5–6 (official-facing):
Official portal + Analytics.

**Step 8** — Mobile app:
Expo setup, voice recording, offline queue, QR scanner, push notifications.

**Step 9** — AI/ML backend:
Duplicate detection embeddings, surge detection, department scoring.

**Step 10** — Security hardening + demo data + README.

\---

# FUTURE SCOPE (mention in documentation, do not build)

The following are intentionally out of scope for this demo and should be documented as future enhancements:

1. **Multi-jurisdiction blockchain nodes** — running complaint hashes across multiple independent blockchain networks (Ethereum mainnet + Polygon + private chain) so no single entity controls the record
2. **OpenTimestamps anchoring** — anchoring to Bitcoin blockchain via OpenTimestamps protocol for maximum permanence
3. **Zero-knowledge identity proofs** — allowing citizens to prove they filed a complaint without revealing their identity, using zk-SNARK cryptography
4. **SMS / WhatsApp filing** — Twilio integration so citizens without smartphones can file via SMS or WhatsApp
5. **NGO automated backup** — daily encrypted export of all complaints to partner NGO servers as a secondary data resilience layer
6. **Government API integration** — official REST API for government departments to integrate VeriVoice into existing systems
7. **SLA enforcement** — automated escalation when departments breach response time commitments
8. **50+ language expansion** — dedicated fine-tuned models for each regional language
9. **Hyperledger Fabric private chain** — for deployments where governments require private (non-public) blockchain infrastructure

\---

\---

*VeriVoice Master Build Prompt — Version 1.0
Covers: Blockchain · Firebase · Next.js · React Native · Claude API · FastAPI · Cybersecurity*

