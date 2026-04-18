import { ethers } from 'ethers';
import contractData from './contract.json';

// ethers.js interaction with deployed VeriVoice contract
// Uses a backend wallet (not user's wallet) — citizens don't need MetaMask

export async function anchorToBlockchain(
  complaintId: string,
  hash: string
): Promise<{ txHash: string; blockNumber: number }> {
  // IMPORTANT: This function must only be called server-side (e.g. Next.js API route)
  if (!process.env.VERIVOICE_PRIVATE_KEY || !process.env.NEXT_PUBLIC_CHAIN_RPC_URL) {
    throw new Error("Missing blockchain environment variables");
  }

  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.VERIVOICE_PRIVATE_KEY, provider);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractData.address;
  const contract = new ethers.Contract(contractAddress, contractData.abi, wallet);

  const tx = await contract.anchorComplaint(complaintId, hash);
  const receipt = await tx.wait();

  return { 
    txHash: receipt.hash, 
    blockNumber: receipt.blockNumber 
  };
}

export async function verifyOnChain(
  complaintId: string,
  hash: string
): Promise<boolean> {
  const rpcUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
  if (!rpcUrl) {
      throw new Error("Missing RPC URL for verification");
  }
    
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractData.address;
  const contract = new ethers.Contract(contractAddress, contractData.abi, provider);

  return await contract.verifyHash(complaintId, hash);
}

export async function getChainRecord(complaintId: string): Promise<{
  hash: string;
  timestamp: number;
  txHash: string; // The specific API getComplaint doesn't return txHash directly unless indexed, we mock it or fetch events
} | null> {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractData.address;
    const contract = new ethers.Contract(contractAddress, contractData.abi, provider);

    const record = await contract.getComplaint(complaintId);
    
    // We can query events to get the exact txHash if needed, doing a basic filter:
    const filter = contract.filters.ComplaintAnchored(complaintId);
    const events = await contract.queryFilter(filter);
    const txHash = events.length > 0 ? events[0].transactionHash : '';

    return {
      hash: record[0],
      timestamp: Number(record[1]) * 1000,
      txHash: txHash
    };
  } catch (error) {
    console.error(`Error fetching on-chain record for ${complaintId}:`, error);
    return null;
  }
}

export function getEtherscanLink(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
