import { useState, useEffect } from 'react';
import { Settings2, Star, CheckCircle2, ShoppingBasket, Copy, Check } from 'lucide-react';
import { chefDashboardAPI } from '../../services/api';
import useStore from '../../hooks/useStore';
import toast from 'react-hot-toast';

const cuisines = [
  'North-Indian', 'South-Indian', 'Mughlai', 'Punjabi', 'Sattvic', 'Bengali', 'Gujarati',
  'Jain', 'Hyderabadi', 'Maharashtrian', 'Kashmiri', 'Malayali', 'Goan', 'Parsi',
  'Indo-Chinese', 'Chaat'
];

export default function ChefDashboard() {
  const { user } = useStore();
  const inviteCode = user?.inviteCode;
  const [copied, setCopied] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [menu, setMenu] = useState(null);
  const [stats, setStats] = useState(null);
  const [sentiment, setSentiment] = useState({ positive: 0, balance: 0, packaging: 0 });
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, statsRes, profRes, sentRes, ingRes] = await Promise.all([
        chefDashboardAPI.getMenu(),
        chefDashboardAPI.getStats(),
        chefDashboardAPI.getProfile(),
        chefDashboardAPI.getSentiment(),
        chefDashboardAPI.getIngredients()
      ]);
      setMenu(menuRes.data);
      setStats(statsRes.data);
      setSelectedCuisines(profRes.data.specialties || []);
      setSentiment(sentRes.data);
      setIngredients(ingRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleCuisine = async (c) => {
    const nextCuisines = selectedCuisines.includes(c) 
      ? selectedCuisines.filter((item) => item !== c)
      : selectedCuisines.length < 4 ? [...selectedCuisines, c] : selectedCuisines;
      
    setSelectedCuisines(nextCuisines);
    try {
      await chefDashboardAPI.updateProfile({ specialties: nextCuisines });
      toast.success('Specialties updated');
    } catch (err) {
      toast.error('Failed to save specialties');
    }
  };

  const handlePublish = async () => {
    try {
      await chefDashboardAPI.publishMenu();
      toast.success('Menu published successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to publish menu');
    }
  };

  const handleCopyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      toast.success('Invite code copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rust"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      <div className="mb-8 px-4 sm:px-0">
        <h2 className="text-xs font-semibold text-rust uppercase tracking-widest mb-2">Management</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-ink">Chef Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={handlePublish} className="px-6 py-2 rounded-full bg-[#D98A52] text-white font-medium shadow-md hover:bg-[#c27642] transition-colors">
              Publish Menu
            </button>
          </div>
        </div>
      </div>

      {/* ── Delivery Partner Invite Code ─────────────────────────────────── */}
      {inviteCode && (
        <div className="mx-4 sm:mx-0 mb-8 bg-[#302E2B] rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Delivery Partner Invite Code
            </p>
            <p className="text-white/80 text-sm mb-1">Share this code with your delivery partner to link them to your kitchen.</p>
            <p className="text-3xl font-black text-[#D98A52] tracking-widest font-mono">{inviteCode}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 px-4 sm:px-0">
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E1D6] shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-1">Subscribers</p>
          <p className="text-3xl font-bold text-ink">{stats?.totalSubscribers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E1D6] shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-ink">{stats?.pendingOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E1D6] shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-1">Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-ink">{stats?.rating || 4.5}</p>
            <Star className="w-5 h-5 fill-[#D98A52] text-[#D98A52]" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E1D6] shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-1">Monthly Earnings</p>
          <p className="text-2xl sm:text-3xl font-bold text-ink">₹{stats?.monthlyEarnings?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Cuisine Specialization block */}
      <div className="bg-[#F2F0EA] rounded-[2rem] p-6 sm:p-8 mb-12 mx-4 sm:mx-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-rust text-white p-2 rounded-lg shadow-sm">
            <Settings2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-ink">Cuisine Specialization</h3>
          <span className="text-sm text-ink-secondary hidden sm:inline ml-2">(Select up to 4 tags)</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {cuisines.map((c) => {
            const isSelected = selectedCuisines.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#A3D9A5] text-green-900 shadow-sm'
                    : 'bg-white text-ink-secondary hover:bg-white/60 hover:text-ink'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Menu display */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5E1D6] shadow-sm mb-12 mx-4 sm:mx-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-ink">Active Signature Menu</h3>
          {menu?.updatedAt && (
            <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest">
              Last updated: {new Date(menu.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {menu?.title ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-rust/10 text-rust rounded-full text-[10px] font-bold uppercase tracking-widest">
                {menu.isVeg ? '🟢 Pure Veg' : '🔴 Non-Veg'}
              </div>
              <h4 className="text-3xl font-bold text-ink leading-tight">{menu.title}</h4>
              <p className="text-ink-secondary leading-relaxed">{menu.description}</p>
              <div className="text-2xl font-bold text-[#D98A52]">₹{menu.price} <span className="text-xs font-medium text-ink-tertiary tracking-normal uppercase">per delivery</span></div>
            </div>
            <div className="bg-[#F2F0EA] rounded-3xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-rust rounded-full mt-2" />
                <div>
                  <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-1">Starter</p>
                  <p className="font-bold text-ink">{menu.starter || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-rust rounded-full mt-2" />
                <div>
                  <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-1">Main Course</p>
                  <p className="font-bold text-ink text-lg">{menu.mainCourse}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-rust rounded-full mt-2" />
                <div>
                  <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-1">Accompaniments</p>
                  <p className="font-bold text-ink">{menu.accompaniments || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F9F8F6] rounded-3xl border border-dashed border-[#C5BAA8]">
            <p className="text-ink-secondary mb-4">No active menu published yet.</p>
            <button onClick={() => window.location.href='/chef/post-menu'} className="btn-primary">
              Create First Menu
            </button>
          </div>
        )}
      </div>

      {/* Bottom Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 px-4 sm:px-0">
        {/* Sentiment */}
        <div className="bg-[#3D6343] rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden text-white shadow-xl min-h-[300px]">
             <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
             <h3 className="text-2xl font-bold mb-2 relative z-10">Subscriber Sentiment</h3>
             <p className="text-sm text-white/80 mb-8 relative z-10">Based on recent customer feedback</p>

             <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Overall Positive</span>
                    <span>{sentiment.positive}%</span>
                  </div>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${sentiment.positive}%` }}></div>
                  </div>
                </div>
                 <div>
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Spice Balance</span>
                    <span>{sentiment.balance}%</span>
                  </div>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full transition-all duration-1000 delay-200" style={{ width: `${sentiment.balance}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Packaging Quality</span>
                    <span>{sentiment.packaging}%</span>
                  </div>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full transition-all duration-1000 delay-500" style={{ width: `${sentiment.packaging}%` }}></div>
                  </div>
                </div>
             </div>
        </div>
        
        {/* Ingredient Tracker */}
        <div className="bg-[#F2F0EA] rounded-[2rem] p-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden shadow-sm border border-[#E5E1D6]">
            <div className="flex-1 z-10 relative">
               <h3 className="text-2xl font-bold text-ink mb-3">Ingredient Tracker</h3>
               <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                 Based on your active menu, we've estimated your bulk grocery needs.
               </p>
               <div className="space-y-3 mb-6 max-h-[120px] overflow-y-auto pr-2">
                  {ingredients.length > 0 ? ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-[#E5E1D6]">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span className="font-bold text-ink uppercase">{ing.name}</span>
                       </div>
                       <span className="text-ink-muted">Estimated: {ing.qty}</span>
                    </div>
                  )) : (
                    <p className="text-ink-tertiary italic text-xs">Publish a menu to see ingredients.</p>
                  )}
               </div>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-[#965A27] text-white rounded-full font-medium text-sm shadow-md hover:bg-[#7A481F] transition-colors">
                  <ShoppingBasket className="w-4 h-4" />
                  View List
               </button>
            </div>
            <div className="w-full sm:w-1/3 bg-black rounded-3xl shrink-0 overflow-hidden shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop" alt="Spices" className="w-full h-full object-cover opacity-80" />
            </div>
         </div>
      </div>
    </div>
  );
}
