import { useState, useEffect } from 'react';
import { Camera, Leaf, Droplet, Flame, Zap, Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { chefDashboardAPI } from '../../services/api';

export default function ChefPostMenu() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    starter: '',
    mainCourse: '',
    accompaniments: '',
    isVeg: true,
    price: 45,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await chefDashboardAPI.getMenu();
        if (res.data) {
          setForm({
            title: res.data.title || '',
            description: res.data.description || '',
            starter: res.data.starter || '',
            mainCourse: res.data.mainCourse || '',
            accompaniments: res.data.accompaniments || '',
            isVeg: res.data.isVeg ?? true,
            price: res.data.price || 45,
          });
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        toast.error('Failed to load existing menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = async () => {
    if (!form.title || !form.mainCourse) {
      toast.error('Title and Main Course are required.');
      return;
    }
    
    setSaving(true);
    try {
      await chefDashboardAPI.updateMenu(form);
      toast.success('Signature menu lives synced to patrons!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update menu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-rust w-8 h-8" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 font-sans pb-24 relative min-h-screen flex flex-col">
      <div className="mb-10">
        <h2 className="text-xs font-semibold text-rust uppercase tracking-widest mb-2">Curate Experience</h2>
        <h1 className="text-4xl font-bold text-ink">Post New Menu</h1>
        <p className="text-ink-secondary mt-2">Craft an editorial dining experience for your patrons. Define the narrative of your culinary creation below.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-8 mb-12">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D98A52] text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
            <span className="text-sm font-bold text-ink">Essentials</span>
         </div>
         <div className="w-8 h-px bg-[#E5E1D6]"></div>
         <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[#E5E1D6] text-ink-secondary flex items-center justify-center font-bold text-sm">2</div>
            <span className="text-sm font-medium text-ink-secondary">The Course</span>
         </div>
         <div className="w-8 h-px bg-[#E5E1D6]"></div>
         <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[#E5E1D6] text-ink-secondary flex items-center justify-center font-bold text-sm">3</div>
            <span className="text-sm font-medium text-ink-secondary">Visuals & Story</span>
         </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 flex-1">
          {/* Left Large Column (70%) */}
          <div className="md:col-span-2 space-y-8">
             <div className="bg-[#F2F0EA] rounded-[2rem] p-8">
                {/* Inputs block */}
                <div className="mb-6">
                   <label className="block text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-3">Menu Narrative Title</label>
                   <input 
                     type="text" 
                     value={form.title}
                     onChange={(e) => update('title', e.target.value)}
                     placeholder="e.g. Autumnal Tuscan Harvest" 
                     className="w-full bg-white px-6 py-4 rounded-2xl border border-white focus:border-rust outline-none transition-colors shadow-sm text-ink font-medium" 
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-3">Detailed Description</label>
                   <textarea 
                     value={form.description}
                     onChange={(e) => update('description', e.target.value)}
                     placeholder="Describe the inspiration, flavor profiles, and sensory journey of this menu..." 
                     className="w-full bg-white px-6 py-4 rounded-2xl border border-white focus:border-rust outline-none transition-colors shadow-sm text-ink min-h-[120px] resize-none"
                   />
                </div>
             </div>

             {/* The Menu Structure Section */}
             <div>
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-ink">The Menu Structure</h3>
                   <div className="flex items-center gap-2 bg-[#F2F0EA] px-4 py-1.5 rounded-full border border-[#E5E1D6]">
                      <Zap className="w-3 h-3 text-[#B08945]" />
                      <span className="text-[10px] font-bold text-ink uppercase tracking-widest">Total Calories</span>
                      <span className="text-xs font-bold text-ink-secondary ml-2">~650 KCAL</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {/* Starter */}
                   <div className="bg-[#Fdfcfb] rounded-[2rem] p-6 border border-[#E5E1D6] hover:border-rust/30 transition-colors shadow-sm h-48 flex flex-col justify-between focus-within:border-rust">
                      <div className="flex items-center justify-between">
                         <div className="w-8 h-8 rounded-full bg-[#EBE9E1] flex items-center justify-center"><Leaf className="w-4 h-4 text-ink-secondary"/></div>
                         <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">Starter</span>
                      </div>
                      <div className="text-left mt-auto">
                         <input 
                           type="text" 
                           placeholder="Starter Name" 
                           value={form.starter}
                           onChange={(e) => update('starter', e.target.value)}
                           className="text-ink-tertiary text-sm w-full bg-transparent outline-none placeholder:text-ink-tertiary/50"
                         />
                      </div>
                   </div>

                   {/* Main Course */}
                   <div className="bg-[#Fdf3e7] rounded-[2rem] p-6 border border-[#C0602F] shadow-md h-48 flex flex-col justify-between relative overflow-hidden focus-within:border-[#9A501B]">
                      <span className="absolute top-0 right-8 bg-[#9A501B] text-white text-[8px] font-bold px-2 py-1 rounded-b-md tracking-widest uppercase">Signature</span>
                      <div className="flex items-center justify-between mt-2">
                         <div className="w-8 h-8 rounded-full bg-[#EAC9AD] flex items-center justify-center"><Flame className="w-4 h-4 text-[#9A501B]"/></div>
                         <span className="text-[9px] font-bold text-[#9A501B] uppercase tracking-widest">Main Course</span>
                      </div>
                      <div className="text-left mt-auto">
                         <input 
                           type="text" 
                           placeholder="Main Course Name" 
                           value={form.mainCourse}
                           onChange={(e) => update('mainCourse', e.target.value)}
                           className="text-ink font-bold mb-2 w-full bg-transparent outline-none placeholder:text-ink/40"
                         />
                         <button className="flex items-center gap-1 text-[10px] font-bold text-[#C0602F] hover:text-[#9A501B] uppercase tracking-wider">
                           <Plus className="w-3 h-3" /> Define portions
                         </button>
                      </div>
                   </div>

                   {/* Accompaniments */}
                   <div className="bg-[#Fdfcfb] rounded-[2rem] p-6 border border-[#E5E1D6] hover:border-rust/30 transition-colors shadow-sm h-48 flex flex-col justify-between focus-within:border-rust">
                      <div className="flex items-center justify-between">
                         <div className="w-8 h-8 rounded-full bg-[#EBE9E1] flex items-center justify-center"><Droplet className="w-4 h-4 text-green-700"/></div>
                         <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">Accompaniments</span>
                      </div>
                      <div className="text-left mt-auto">
                         <input 
                           type="text" 
                           placeholder="Accompaniments" 
                           value={form.accompaniments}
                           onChange={(e) => update('accompaniments', e.target.value)}
                           className="text-ink-tertiary text-sm w-full bg-transparent outline-none placeholder:text-ink-tertiary/50"
                         />
                      </div>
                   </div>
                </div>
             </div>

             {/* Capture the Soul Dropzone */}
             <div className="bg-[#F2F0EA] rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-64 border border-[#E5E1D6] shadow-sm">
                <div className="flex-1 p-8 flex flex-col justify-center">
                   <h3 className="text-2xl font-bold text-ink mb-2">Capture the Soul</h3>
                   <p className="text-xs text-ink-secondary leading-relaxed mb-6">High-resolution imagery is the bridge between your kitchen and their table. Upload shots that capture texture, steam, and vibrant colors.</p>
                   <button className="flex items-center justify-center gap-2 bg-[#D98A52] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#c27642] transition-colors self-start">
                     <Camera className="w-4 h-4"/> Upload Hero Images
                   </button>
                </div>
                <div className="w-full md:w-64 bg-[#E5E1D6] relative">
                   <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview"/>
                   <div className="absolute inset-0 flex items-center justify-center flex-col text-white cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
                     <Camera className="w-8 h-8 mb-2" />
                     <span className="text-[10px] font-bold tracking-widest uppercase">Preview Area</span>
                   </div>
                </div>
             </div>

          </div>

          {/* Right Small Column (30%) */}
          <div className="space-y-6">
             {/* Dietary Identity */}
             <div className="bg-[#EBE9E1] rounded-[2rem] p-8 border border-[#E5E1D6]">
                <h4 className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest mb-4">Dietary Identity</h4>
                <div className="flex bg-white rounded-full p-1 shadow-sm">
                  <button 
                    onClick={() => update('isVeg', true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${form.isVeg ? 'bg-[#3D6343] text-white shadow-sm' : 'text-ink-secondary hover:text-ink'}`}>
                     <Leaf className="w-4 h-4"/> Veg
                  </button>
                  <button 
                    onClick={() => update('isVeg', false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${!form.isVeg ? 'bg-[#9A501B] text-white shadow-sm' : 'text-ink-secondary hover:text-ink'}`}>
                     Non-Veg
                  </button>
                </div>
             </div>

             {/* Pricing Authority */}
             <div className="bg-[#Fdf3e7] rounded-[2rem] p-8 border border-[#FBEAC8] shadow-md flex flex-col justify-center items-center text-center">
                <h4 className="text-[10px] font-bold text-[#C0602F] uppercase tracking-widest mb-4 w-full text-left">Pricing Authority</h4>
                <div className="flex items-start text-[#D98A52] mb-1">
                   <span className="text-2xl font-bold mt-1 mr-1">₹</span>
                   <input 
                     type="number" 
                     value={form.price}
                     onChange={(e) => update('price', e.target.value)}
                     className="bg-transparent text-5xl font-black w-36 outline-none text-center" 
                   />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#C0602F] uppercase tracking-widest mt-2 border-t border-[#FBEAC8] w-full pt-4 justify-center">
                   Per tiffin delivery
                </div>
             </div>
          </div>
      </div>

      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#F9F8F6]/90 backdrop-blur-md border-t border-[#E5E1D6] py-4 px-8 flex items-center justify-between">
         <span className="text-xs font-bold text-ink-secondary tracking-widest">Live Auto-Sync On</span>
         <div className="flex items-center gap-4">
            <button className="px-6 py-2 rounded-full border border-[#E5E1D6] text-ink text-sm font-bold hover:bg-black/5 transition-colors">Discard</button>
            <button 
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2 rounded-full bg-[#302E2B] text-white text-sm font-bold shadow-md hover:bg-black transition-colors disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Update Signature Menu'}
            </button>
         </div>
      </div>

    </div>
  );
}

