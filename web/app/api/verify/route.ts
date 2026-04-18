import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { getChainRecord, verifyOnChain } from '@/lib/blockchain';
import { sha256 } from '@/lib/hash';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 });

  try {
    if (type === 'id') {
      const doc = await adminDb.collection('COMPLAINTS').doc(q).get();
      if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const data = doc.data();
      const dbText = data?.text || '';
      
      // Calculate hash of current db text
      const computedHash = await sha256(dbText);
      const isVerified = await verifyOnChain(q, computedHash);

      const chainRecord = await getChainRecord(q);

      return NextResponse.json({
        id: q,
        isVerified,
        dbHash: computedHash,
        chainHash: chainRecord?.hash || null,
        txHash: data?.blockchainTx || chainRecord?.txHash || null,
        complaint: data, // Exposing the full complaint details
      });

    } else if (type === 'hash') {
      // Find if hash exists in our DB to match it up, or just say if it's on chain for any ID (Harder without an ID, so let's check DB first)
      const scan = await adminDb.collection('COMPLAINTS').where('hash', '==', q).limit(1).get();
      
      if (scan.empty) {
         // In a real robust app, we'd need a subgraph to query bare hashes on contract.
         return NextResponse.json({ error: 'Hash not found in localized DB.' }, { status: 404 });
      }

      const doc = scan.docs[0];
      const data = doc.data();

      // Check against blockchain
      const isVerified = await verifyOnChain(data.id, data.hash);
      const chainRecord = await getChainRecord(data.id);

      return NextResponse.json({
        id: data.id,
        isVerified,
        dbHash: data.hash,
        chainHash: chainRecord?.hash || null,
        txHash: data.blockchainTx || chainRecord?.txHash || null,
        complaint: data,
      });
    }

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
