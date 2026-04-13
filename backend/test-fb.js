const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCyG9-pBGgzbmFUaIR6KpkkU5MKt8pLCsw",
  authDomain: "swaad-70d86.firebaseapp.com",
  databaseURL: "https://swaad-70d86-default-rtdb.firebaseio.com",
  projectId: "swaad-70d86",
  storageBucket: "swaad-70d86.firebasestorage.app",
  messagingSenderId: "169588860526",
  appId: "1:169588860526:web:d2b4ac2dfde00fc166a87f",
  measurementId: "G-JFH6H14XVM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function test() {
  try {
    const r = Math.random().toString(36).substring(7);
    const cr = await createUserWithEmailAndPassword(auth, `test${r}@example.com`, 'Testpassword123!');
    console.log("Success:", cr.user.uid);
    process.exit(0);
  } catch (e) {
    console.error("Firebase Auth Error:", e.code, e.message);
    process.exit(1);
  }
}

test();
