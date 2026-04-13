// Firebase Client SDK — initialized lazily from backend config endpoint.
// Firebase keys live in backend/.env only. The backend serves config via GET /api/config/firebase.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let _auth = null;

// Kick off initialization immediately at module load time
const _initPromise = (async () => {
  try {
    // Already initialized (e.g. HMR in dev)
    if (getApps().length > 0) {
      _auth = getAuth(getApp());
      return _auth;
    }

    const res = await fetch(`${API_BASE}/config/firebase`);
    if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);

    const config = await res.json();

    if (!config.apiKey) throw new Error('Firebase config is incomplete — check backend .env');

    const app = initializeApp(config);
    _auth = getAuth(app);
    return _auth;
  } catch (err) {
    console.error('[firebase.js] Initialization failed:', err.message);
    throw err;
  }
})();

/**
 * Awaits Firebase initialization and returns the Auth instance.
 * Safe to call at any time — subsequent calls resolve instantly.
 */
export async function getFirebaseAuth() {
  return await _initPromise;
}

/**
 * Synchronous accessor — returns the Auth instance if already initialized, else null.
 * Use inside callbacks/interceptors that run after the first await of getFirebaseAuth().
 */
export function getAuthSync() {
  return _auth;
}
