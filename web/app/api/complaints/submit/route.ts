import { NextResponse } from 'next/server';
import { generateComplaintId, sha256 } from '@/lib/hash';
import { anchorToBlockchain, getEtherscanLink } from '@/lib/blockchain';
import { adminDb, admin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, voiceTranscript, location, submitterToken } = body;

    const actualText = text || voiceTranscript;

    if (!actualText || actualText.length < 20 || actualText.length > 2000) {
      return NextResponse.json(
        { error: 'Complaint text must be between 20 and 2000 characters.' },
        { status: 400 }
      );
    }

    // 1. Generate unique ID & Hash
    const complaintId = generateComplaintId();
    const hash = await sha256(actualText);

    // 2. Hash submitter token for privacy
    let hashedToken = null;
    if (submitterToken) {
      hashedToken = await sha256(submitterToken);
    }

    // 3. Call AI Classification (FastAPI Backend)
    // We use a try/catch here so the complaint isn't completely lost if the AI backend is down.
    let classification = {
      category: 'Other',
      severity: 1,
      department: 'Unassigned',
      summary: 'Pending classification',
      language: 'unknown'
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://verivoice.onrender.com';
      const aiResponse = await fetch(`${backendUrl}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId, text: actualText })
      });

      if (aiResponse.ok) {
        classification = await aiResponse.json();
      } else {
        console.warn('AI Classification failed with status:', aiResponse.status);
      }
    } catch (aiError) {
      console.warn('AI Classification service unreachable:', aiError);
    }

    // 4. Store in Firestore securely via Admin SDK 
    // (Bypasses the "Only pending on creation" rule restrictions from client, ensuring trustworthy initialization)
    const docRef = adminDb.collection('COMPLAINTS').doc(complaintId);
    
    await docRef.set({
      id: complaintId,
      text: actualText,
      hash,
      category: classification.category,
      severity: classification.severity,
      department: classification.department,
      summary: classification.summary,
      language: classification.language,
      status: 'pending',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      location: location || null,
      blockchainTx: null,
      blockchainBlock: null,
      submitterToken: hashedToken,
      tampered: false
    });

    // 5. Anchor to Blockchain
    let blockchainResult = null;
    try {
      blockchainResult = await anchorToBlockchain(complaintId, hash);
      
      // Update Firestore with the blockchain transaction details
      await docRef.update({
        blockchainTx: blockchainResult.txHash,
        blockchainBlock: blockchainResult.blockNumber
      });
    } catch (blockchainError) {
      console.error('Blockchain anchoring queue failed/timeout:', blockchainError);
      // Error handling spec: If blockchain anchoring fails, still save to Firebase and 
      // return success to user, maybe queue anchoring for retry later.
    }

    // 6. Return standard response
    return NextResponse.json({
      complaintId,
      hash,
      blockchainTx: blockchainResult?.txHash || null,
      etherscanLink: blockchainResult ? getEtherscanLink(blockchainResult.txHash) : null,
      timestamp: Date.now()
    }, { status: 201 });

  } catch (error: any) {
    console.error('Complaint submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing complaint.' },
      { status: 500 }
    );
  }
}
