const admin = require('firebase-admin');
const path = require('path');

// Reference to your Realtime Database URL
const DATABASE_URL = 'https://swaad-70d86-default-rtdb.firebaseio.com/';

// Only initialize if not already done (avoids errors in serverless or some dev environments)
if (!admin.apps.length) {
  try {
    // Priority 1: Environment Variable (Base64 or JSON string for Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      let serviceAccount;
      try {
         // Attempt to parse directly, or parse base64 if it's encoded
         const rawVar = process.env.FIREBASE_SERVICE_ACCOUNT;
         if (rawVar.trim().startsWith('{')) {
             serviceAccount = JSON.parse(rawVar);
         } else {
             const buff = Buffer.from(rawVar, 'base64');
             serviceAccount = JSON.parse(buff.toString('utf-8'));
         }
         
         admin.initializeApp({
           credential: admin.credential.cert(serviceAccount),
           databaseURL: DATABASE_URL
         });
         console.log('✅ Firebase Admin SDK initialized from ENV');
      } catch (e) {
         console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
      }
    } 
    // Priority 2: Local JSON file (For Local Development)
    else {
      const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
      const fs = require('fs');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: DATABASE_URL
        });
        console.log('✅ Firebase Admin SDK initialized from local file');
      } else {
        console.error('\n⚠️  MISSING: FIREBASE_SERVICE_ACCOUNT env var or serviceAccountKey.json');
        console.error('⚠️  Firebase Admin will run in limited mode (some auth logic will fail).\n');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
  }
} else {
  console.log('ℹ️ Firebase Admin already initialized');
}

// Export database references
const db = admin.database(); // Realtime Database
const firestore = admin.firestore(); // Firestore (recommended)
const auth = admin.auth();

module.exports = { admin, db, firestore, auth };
