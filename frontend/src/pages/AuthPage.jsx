import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { EyeOff, Eye, User, ChefHat, Bike, HelpCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { getFirebaseAuth, getAuthSync } from '../services/firebase';
import toast from 'react-hot-toast';

const ROLE_DASHBOARDS = {
  chef: '/chef/dashboard',
  deliveryPartner: '/partner/dashboard',
  customer: '/customer/home',
};

export default function AuthPage({ mode = 'login', defaultRole }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(mode);
  const [role, setRole] = useState(defaultRole || 'Customer');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = tab === 'login';

  const leftImage = isLogin
    ? 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1200&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop';

  const normalizeRole = (r) => {
    const lower = r.toLowerCase();
    if (lower === 'home chef' || lower === 'chef') return 'chef';
    if (lower === 'partner') return 'deliveryPartner';
    return 'customer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedRole = normalizeRole(role);

      if (isLogin) {
        // ── Step 1: Login with Firebase ───────────────────────────────────
        const auth = await getFirebaseAuth();
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const firebaseUser = cred.user;

        // ── Step 2: Send idToken to backend (back-fills custom claims if needed)
        const idToken = await firebaseUser.getIdToken();
        const res = await authAPI.login(idToken);
        const data = res.data;

        // ── Step 3: Force-refresh token to get the latest custom claims ───
        await firebaseUser.getIdToken(/* forceRefresh */ true);
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const claimRole = tokenResult.claims.role || data.role || 'customer';

        // ── Step 4: Verify role tab selection matches actual role ─────────
        const selectedRole = normalizeRole(role);
        if (data.role !== selectedRole) {
          const auth = getAuthSync();
          if (auth) await auth.signOut();
          toast.error(`Access Denied: You are registered as a ${data.role}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        toast.success('Welcome back!');
        navigate(ROLE_DASHBOARDS[claimRole] || '/customer/home');

      } else {
        // ── Step 1: Create user in Firebase Auth ──────────────────────────
        const auth = await getFirebaseAuth();
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const firebaseUser = cred.user;

        const fullName = `${form.firstName} ${form.lastName}`.trim();

        // ── Step 2: Set Firebase display name ─────────────────────────────
        await updateFirebaseProfile(firebaseUser, { displayName: fullName });

        // ── Step 3: Register profile in backend (Firestore + custom claims)
        const idToken = await firebaseUser.getIdToken();
        const res = await authAPI.signup({
          idToken,
          name: fullName,
          role: normalizedRole,
        });
        const data = res.data;

        // ── Step 4: Force-refresh token so AuthContext picks up new claims ─
        await firebaseUser.getIdToken(true);

        toast.success('Account created successfully!');
        navigate(ROLE_DASHBOARDS[data.role] || '/customer/home');
      }
    } catch (err) {
      const code = err.code || '';
      const msgs = {
        'auth/user-not-found':        'No account found with this email.',
        'auth/wrong-password':        'Incorrect password. Please try again.',
        'auth/email-already-in-use':  'This email is already registered. Try logging in.',
        'auth/weak-password':         'Password must be at least 6 characters.',
        'auth/invalid-email':         'Please enter a valid email address.',
        'auth/too-many-requests':     'Too many attempts. Please wait a moment.',
        'auth/invalid-credential':    'Invalid email or password.',
        'auth/operation-not-allowed': 'Email/Password accounts are NOT enabled in your Firebase Console.',
        'auth/invalid-api-key':       'Invalid Firebase API Key in your .env file.',
      };
      const fallback = `Authentication failed: ${err.message || 'Unknown error'}`;
      const message = msgs[code] || err.response?.data?.message || fallback;
      toast.error(message);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex min-h-screen bg-[#F9F8F6] font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative bg-black flex-col justify-between overflow-hidden">
        <img
          src={leftImage}
          alt="Auth Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 px-12 pt-12">
          <h1 className="text-white text-2xl font-bold tracking-tight">SWAAD</h1>
        </div>

        <div className="relative z-10 px-12 pb-16 max-w-lg">
          {isLogin ? (
            <>
              <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
                The art of curated <br />
                <span className="text-[#F8C324] font-serif italic text-6xl">daily dining.</span>
              </h2>
              <p className="text-white/90 text-[15px] leading-relaxed max-w-sm">
                Join our exclusive circle of chefs and food enthusiasts who believe dinner should be the highlight of every day.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
                Elevate your daily <br />
                <span className="text-[#E08A63] font-serif italic text-6xl">dining ritual.</span>
              </h2>
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mt-1">
                <span className="bg-[#E08A63] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">★</span>
                <span className="text-white/90 text-xs font-semibold">Over 2,000 artisan chefs nationwide</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">

        {isLogin && (
          <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <HelpCircle size={20} className="text-[#AD4924]" />
          </div>
        )}

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[#5A5A5A] text-[15px]">
              {isLogin
                ? 'Please enter your details to continue your culinary journey.'
                : 'Join our curated kitchen community today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ROLE SELECTORS */}
            {isLogin ? (
              <div className="flex bg-[#F0EFEC] p-1.5 rounded-full mb-6">
                {['Customer', 'Chef', 'Partner'].map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                      role === r ? 'bg-white text-[#AD4924] shadow-sm' : 'text-[#8D8D8D] hover:text-[#5A5A5A]'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 mb-6">
                {[
                  { r: 'Customer',  icon: User },
                  { r: 'Home Chef', icon: ChefHat },
                  { r: 'Partner',   icon: Bike },
                ].map(({ r, icon: Icon }) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-3xl transition-all border-2 ${
                      role === r
                        ? 'border-[#AD4924] bg-[#F9F8F6] text-[#AD4924]'
                        : 'border-transparent bg-[#F0EFEC] text-[#8D8D8D] hover:bg-[#EBE9E4]'
                    }`}>
                    <Icon size={20} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{r}</span>
                  </button>
                ))}
              </div>
            )}

            {/* NAME FIELDS (signup only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D2D2D] mb-1.5 ml-1">First Name</label>
                  <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required
                    placeholder="John"
                    className="w-full bg-[#EBE9E4] text-[#2D2D2D] text-[15px] px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#AD4924]/20 transition-all placeholder:text-[#ADADAD]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#2D2D2D] mb-1.5 ml-1">Last Name</label>
                  <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required
                    placeholder="Doe"
                    className="w-full bg-[#EBE9E4] text-[#2D2D2D] text-[15px] px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#AD4924]/20 transition-all placeholder:text-[#ADADAD]" />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[11px] font-bold text-[#2D2D2D] mb-1.5 ml-1">Email Address</label>
              <input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" required
                placeholder={isLogin ? 'name@example.com' : 'john.doe@example.com'}
                className="w-full bg-[#EBE9E4] text-[#2D2D2D] text-[15px] px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#AD4924]/20 transition-all placeholder:text-[#ADADAD]" />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                <label className="block text-[11px] font-bold text-[#2D2D2D]">Password</label>
                {isLogin && (
                  <button type="button" className="text-[11px] font-bold text-[#AD4924] hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#EBE9E4] text-[#2D2D2D] text-[15px] px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#AD4924]/20 transition-all placeholder:text-[#ADADAD] tracking-widest"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D8D8D] hover:text-[#2D2D2D]">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-[10px] text-[#8D8D8D] mt-2 ml-1">Minimum 6 characters required.</p>
              )}
            </div>

            {/* TERMS (signup only) */}
            {!isLogin && (
              <div className="flex items-start gap-3 mt-6">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-[#ADADAD] accent-[#AD4924]" />
                <label className="text-[13px] text-[#5A5A5A]">
                  I agree to the{' '}
                  <span className="font-bold text-[#AD4924]">Terms of Service</span> and{' '}
                  <span className="font-bold text-[#AD4924]">Privacy Policy</span>
                </label>
              </div>
            )}

            {/* SUBMIT */}
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#BA632D] to-[#DF8C53] hover:from-[#A25020] hover:to-[#C67640] text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Please wait...
                  </span>
                ) : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </div>

            {/* SOCIAL LOGIN (login only) */}
            {isLogin && (
              <>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-[#E5E0D8]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#ADADAD] font-bold">OR CONTINUE WITH</span>
                  <div className="flex-1 h-px bg-[#E5E0D8]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center gap-2 bg-white border border-[#E5E0D8] rounded-full py-2.5 hover:bg-[#F0EFEC] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[13px] font-bold text-[#2D2D2D]">Google</span>
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 bg-white border border-[#E5E0D8] rounded-full py-2.5 hover:bg-[#F0EFEC] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.56-.05 2.89.65 3.63 1.62-3.14 1.87-2.58 5.92.51 7.02-.75 1.83-1.8 3.3-2.8 4.32zM12.03 7.25C11.83 3.55 15.11 1 17.88 1.13c.27 3.93-3.6 6.57-5.85 6.12z"/>
                    </svg>
                    <span className="text-[13px] font-bold text-[#2D2D2D]">Apple</span>
                  </button>
                </div>
              </>
            )}

            {/* TOGGLE */}
            <div className="text-center pt-6">
              <p className="text-[13px] text-[#5A5A5A]">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setTab(isLogin ? 'signup' : 'login')}
                  className="font-bold text-[#AD4924] hover:underline">
                  {isLogin ? 'Create an account' : 'Log in here'}
                </button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
