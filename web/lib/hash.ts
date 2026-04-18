// SHA-256 hashing using Web Crypto API — runs entirely in browser
// No library needed, built into every modern browser

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyHash(text: string, expectedHash: string): Promise<boolean> {
  const generatedHash = await sha256(text);
  return generatedHash === expectedHash;
}

export function generateComplaintId(): string {
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 8);
  return `VV-${timestamp}-${randomChars}`;
}
