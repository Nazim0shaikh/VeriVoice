import { NextResponse } from 'next/server';
import { generateComplaintId, sha256 } from '@/lib/hash';
import { anchorToBlockchain, getEtherscanLink } from '@/lib/blockchain';
import { adminDb, admin } from '@/lib/firebaseAdmin';

// Light Serverless Rate Limiter (Protects against simple script spam)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000 * 60; // 1 hour
const MAX_REQUESTS = 5;

export async function POST(req: Request) {
  try {
    // 0. Execution of Rate Limiter
    const ip = req.headers.get('x-forwarded-for') || 'default-ip';
    const now = Date.now();
    let rateData = rateLimitMap.get(ip);
    
    if (!rateData || now - rateData.lastReset > WINDOW_MS) {
      rateData = { count: 0, lastReset: now };
    }
    
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    if (rateData.count > MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'You have reached the maximum submission limit. Please wait an hour to submit again.' },
        { status: 429, headers: { 'Retry-After': String(60 * 60) } }
      );
    }

    const body = await req.json();
    const { text, voiceTranscript, location, submitterToken, cfTurnstileResponse } = body;

    // 1. Verify Cloudflare Turnstile Token
    if (!cfTurnstileResponse) {
      return NextResponse.json({ error: 'Security check missing. Please complete the CAPTCHA.' }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAAC_tMlwq0X0ZinS9pIHbNjlPsMc';
    const turnstileVerifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${cfTurnstileResponse}`
    });
    
    const turnstileVerifyData = await turnstileVerifyRes.json();
    if (!turnstileVerifyData.success) {
      console.warn('Turnstile Failed:', turnstileVerifyData);
      return NextResponse.json({ error: 'Security check failed. Bots are not allowed.' }, { status: 403 });
    }

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
      is_civic: true, // Optimistically allow if network error
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

    // 3.5 Semantic AI Bouncer - Save Ledger Gas!
    if (classification.hasOwnProperty('is_civic') && classification.is_civic === false) {
      return NextResponse.json(
        { error: 'AI Verification Failed: Please submit a genuine civic issue. Spam and unrelated messages are forbidden on the immutable ledger.' },
        { status: 406 } // 406 Not Acceptable
      );
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
