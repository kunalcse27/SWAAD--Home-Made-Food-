import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Key, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function PartnerJoin() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // If partner is already linked, redirect straight to dashboard
  if (userProfile?.linkedChefId) {
    navigate('/partner/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error('Please enter an invite code.');
    setLoading(true);

    try {
      const res = await api.post('/chef/join', { inviteCode: code.trim().toUpperCase() });
      toast.success(res.data.message || 'Successfully linked to chef!');
      navigate('/partner/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid invite code. Please check with your chef.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#E5E0D8] overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-[#302E2B] to-[#4a4540] p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D98A52]/20 rounded-full" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#D98A52] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Join a Chef's Team</h1>
              <p className="text-white/70 text-sm">
                Enter the invite code shared by your chef to start delivering for them.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-[#2D2D2D] mb-2 uppercase tracking-widest">
                  Chef's Invite Code
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D98A52]" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CHEF-XK92"
                    maxLength={9}
                    className="w-full bg-[#EBE9E4] text-[#2D2D2D] text-lg font-bold tracking-widest px-5 py-4 pl-11 rounded-xl outline-none focus:ring-2 focus:ring-[#AD4924]/20 transition-all placeholder:text-[#ADADAD] placeholder:font-normal placeholder:tracking-normal uppercase"
                  />
                </div>
                <p className="text-[11px] text-[#8D8D8D] mt-2">
                  Format: CHEF-XXXX (shown on your chef's dashboard)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-gradient-to-r from-[#BA632D] to-[#DF8C53] hover:from-[#A25020] hover:to-[#C67640] text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Join Chef's Team
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[#FFF8F0] rounded-xl border border-[#F0D9C0]">
              <p className="text-[12px] text-[#8C6B3E] leading-relaxed">
                <span className="font-bold">Don't have a code?</span> Ask your chef to share the unique code from their SWAAD dashboard. Codes look like <span className="font-mono font-bold">CHEF-XK92</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
