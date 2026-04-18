import * as admin from 'firebase-admin';

// Read the credentials safely from the environment variable (or safely fallback to standard init without path hacking)
let credential;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length > 50) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    // Ensure the private key has correct newline characters
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.applicationDefault();
  }
} catch (e) {
  console.warn("Could not parse FIREBASE_SERVICE_ACCOUNT_KEY array, defaulting to application scope.", e);
  credential = admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminDb = admin.firestore();

export { adminDb, admin };
