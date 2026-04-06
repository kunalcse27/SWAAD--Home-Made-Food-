import { useState, useEffect } from 'react';
import { Settings2, Calendar, Star, Plus, Check } from 'lucide-react';
import { chefDashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

const cuisines = [
  'North-Indian', 'South-Indian', 'Mughlai', 'Punjabi', 'Sattvic', 'Bengali', 'Gujarati',
  'Jain', 'Hyderabadi', 'Maharashtrian', 'Kashmiri', 'Malayali', 'Goan', 'Parsi',
  'Indo-Chinese', 'Chaat'
];

const weekDays = [
  { day: 'MON', date: '12', active: false },
  { day: 'TUE', date: '13', active: false },
  { day: 'WED', date: '14', active: true, special: true },
  { day: 'THU', date: '15', active: false },
  { day: 'FRI', date: '16', active: false },
  { day: 'SAT', date: '17', active: false },
  { day: 'SUN', date: '18', active: false },
];

export default function ChefDashboard() {
  const [selectedCuisines, setSelectedCuisines] = useState(['Mughlai', 'Sattvic']);
  const [menu, setMenu] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, statsRes] = await Promise.all([
          chefDashboardAPI.getMenu(),
          chefDashboardAPI.getStats()
        ]);
        setMenu(menuRes.data);
        setStats(statsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const toggleCuisine = async (c) => {
    const nextCuisines = selectedCuisines.includes(c) 
      ? selectedCuisines.filter((item) => item !== c)
      : selectedCuisines.length < 4 ? [...selectedCuisines, c] : selectedCuisines;
      
    setSelectedCuisines(nextCuisines);
    // Ideally update profile cuisines via API here
  };

  const handlePublish = async () => {
    try {
      await chefDashboardAPI.publishMenu();
      toast.success('Menu published successfully!');
    } catch (error) {
      toast.error('Failed to publish menu');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-rust uppercase tracking-widest mb-2">Menu Curation</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-ink">Weekly Subscription Setup</h1>
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-full bg-[#EBE9E1] text-ink font-medium hover:bg-[#E0DED4] transition-colors">
              Save as Draft
            </button>
            <button onClick={handlePublish} className="px-6 py-2 rounded-full bg-[#D98A52] text-white font-medium shadow-md hover:bg-[#c27642] transition-colors">
              Publish Menu
            </button>
          </div>
        </div>
      </div>

      {/* Cuisine Specialization block */}
      <div className="bg-[#F2F0EA] rounded-[2rem] p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-rust text-white p-2 rounded-lg">
            <Settings2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-ink">Cuisine Specialization</h3>
          <span className="text-sm text-ink-secondary ml-2">(Select up to 4 tags)</span>
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

      {/* Weekly Rotation Planner */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#8C867B]" />
            <h3 className="text-2xl font-bold text-ink">Weekly Rotation Planner</h3>
          </div>
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-[#E5E1D6]">
            <button className="px-6 py-1.5 rounded-full text-sm font-bold text-rust bg-[#Fdfbfc] shadow-sm">Weekly</button>
            <button className="px-6 py-1.5 rounded-full text-sm font-medium text-ink-secondary hover:text-ink">Monthly</button>
          </div>
        </div>

        {/* Days Grid Container */}
        <div className="grid grid-cols-7 gap-4">
          {/* MONDAY */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Mon</p>
              <h4 className="text-2xl font-bold text-ink">12</h4>
            </div>
            {/* LUNCH CARD */}
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-rust shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-rust tracking-widest uppercase">Lunch</span>
                <button className="text-ink-tertiary hover:text-rust"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Paneer Lababdar & Jeera Rice</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">With fresh cucumber...</p>
            </div>
            {/* DINNER CARD - Empty State */}
            <div className="w-full bg-transparent rounded-3xl p-5 border-2 border-dashed border-[#C5BAA8] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 transition-colors h-32">
              <span className="text-[10px] font-bold text-[#8C867B] tracking-widest uppercase mb-2">Dinner <Plus className="inline w-3 h-3 ml-1"/></span>
              <p className="text-xs text-ink-tertiary">Tap to<br/>define meal</p>
            </div>
          </div>

          {/* TUESDAY */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Tue</p>
              <h4 className="text-2xl font-bold text-ink">13</h4>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-rust shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-rust tracking-widest uppercase">Lunch</span>
                <button className="text-ink-tertiary hover:text-rust"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Dal Tadka & Alu Gobhi</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Authentic homestyle...</p>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-green-600 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-green-700 tracking-widest uppercase">Dinner</span>
                <button className="text-ink-tertiary hover:text-green-700"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Baingan Bharta</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Served with Bajra Roti.</p>
            </div>
          </div>

          {/* WEDNESDAY (Active/Special) */}
          <div className="flex flex-col items-center gap-4 relative">
             <div className="absolute inset-0 bg-[#Fdf3e7] -top-6 -bottom-6 -left-3 -right-3 rounded-[3rem] -z-10 shadow-inner"></div>
            <div className="text-center mt-[2px]">
              <p className="text-xs font-bold text-rust tracking-widest uppercase mb-1">Wed</p>
              <h4 className="text-2xl font-bold text-ink mb-2">14</h4>
              <span className="text-[8px] bg-[#B08945] text-white px-2 py-1 rounded-full uppercase tracking-wider font-bold">Chef's Special</span>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border border-[#E5E1D6] shadow-md relative z-10 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-rust tracking-widest uppercase flex items-center gap-1">Lunch <Star className="w-3 h-3 fill-rust text-rust" /></span>
                <button className="text-ink-tertiary hover:text-rust"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Hyderabadi Dum Biryani</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Mirchi ka Salan & Raita.</p>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-green-600 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-green-700 tracking-widest uppercase">Dinner</span>
                <button className="text-ink-tertiary hover:text-green-700"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Vegetable Jalfrezi</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Lachha Paratha bundle.</p>
            </div>
          </div>

          {/* THURSDAY */}
            <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Thu</p>
              <h4 className="text-2xl font-bold text-ink">15</h4>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-rust shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-rust tracking-widest uppercase">Lunch</span>
                <button className="text-ink-tertiary hover:text-rust"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Bhindi Masala & Dal</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Mild spice level for mid-week.</p>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border border-transparent shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-green-700 tracking-widest uppercase">Dinner</span>
                <button className="text-ink-tertiary hover:text-green-700"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Pindi Chole</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">With fluffy bhatura set.</p>
            </div>
          </div>

           {/* FRIDAY */}
           <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Fri</p>
              <h4 className="text-2xl font-bold text-ink">16</h4>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-rust shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-rust tracking-widest uppercase">Lunch</span>
                <button className="text-ink-tertiary hover:text-rust"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Rajma Masala</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Steam rice & pickled onions.</p>
            </div>
            <div className="w-full bg-white rounded-3xl p-5 border-l-4 border-green-600 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-green-700 tracking-widest uppercase">Dinner</span>
                <button className="text-ink-tertiary hover:text-green-700"><Plus className="w-3 h-3" /></button>
              </div>
              <h5 className="font-bold text-ink text-sm leading-snug mb-2">Indo-Chinese Fusion</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Veg Manchurian & Fried Rice.</p>
            </div>
          </div>

          {/* SATURDAY */}
          <div className="flex flex-col items-center gap-4 opacity-70">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Sat</p>
              <h4 className="text-2xl font-bold text-ink">17</h4>
            </div>
             <div className="w-full bg-transparent rounded-3xl p-5 border-2 border-dashed border-[#C5BAA8] flex flex-col items-center justify-center text-center h-32">
              <div className="w-6 h-6 bg-[#E5E1D6] rounded-full flex items-center justify-center mb-2">
                 <Plus className="w-4 h-4 text-[#8C867B]"/>
              </div>
              <span className="text-[8px] font-bold text-[#8C867B] tracking-widest uppercase">No Lunch Set</span>
            </div>
             <div className="w-full bg-white rounded-3xl p-5 border border-transparent shadow-sm">
              <h5 className="font-bold text-ink text-sm leading-snug mb-2 mt-4">Gatta Curry</h5>
              <p className="text-xs text-ink-secondary italic leading-relaxed">Rajasthani Special.</p>
            </div>
          </div>

           {/* SUNDAY */}
           <div className="flex flex-col items-center gap-4 opacity-50">
            <div className="text-center">
              <p className="text-xs font-bold text-ink-secondary tracking-widest uppercase mb-1">Sun</p>
              <h4 className="text-2xl font-bold text-ink">18</h4>
            </div>
             <div className="w-full bg-transparent rounded-3xl p-5 border border-[#E5E1D6] bg-black/5 flex flex-col items-center justify-center text-center h-32">
              <div className="w-6 h-6 bg-[#C5BAA8] rounded-full flex items-center justify-center mb-2">
                 <Plus className="w-4 h-4 text-white"/>
              </div>
              <span className="text-[8px] font-bold text-[#8C867B] tracking-widest uppercase">Rest Day</span>
            </div>
            <div className="w-full bg-transparent rounded-3xl p-5 border border-dashed border-[#E5E1D6] bg-black/5 flex flex-col items-center justify-center text-center h-32">
              <div className="w-6 h-6 bg-[#C5BAA8] rounded-full flex items-center justify-center mb-2">
                 <Plus className="w-4 h-4 text-white"/>
              </div>
              <span className="text-[8px] font-bold text-[#8C867B] tracking-widest uppercase">Rest Day</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Ingredient Tracker */}
         <div className="bg-[#F2F0EA] rounded-[2rem] p-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden">
            <div className="flex-1 z-10 relative">
               <h3 className="text-2xl font-bold text-ink mb-3">Chef's Ingredient Tracker</h3>
               <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                 Based on your weekly menu, we've generated your bulk procurement list. You'll need roughly 14kg of Basmati Rice and 8kg of Paneer by Sunday.
               </p>
               <button className="px-5 py-2.5 bg-[#965A27] text-white rounded-full font-medium text-sm shadow-md hover:bg-[#7A481F] transition-colors">
                  View Grocery List
               </button>
            </div>
            {/* The dramatic background dark photography element */}
            <div className="w-48 h-48 sm:absolute right-0 top-0 bottom-0 sm:w-1/3 bg-black rounded-l-[3rem] rounded-r-3xl shrink-0 overflow-hidden shadow-2xl relative transform translate-x-4">
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop" alt="Spices" className="w-full h-full object-cover opacity-80" />
            </div>
         </div>

         {/* Sentiment */}
         <div className="bg-[#3D6343] rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden text-white shadow-xl">
             <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
             <h3 className="text-2xl font-bold mb-2 relative z-10">Subscriber Sentiment</h3>
             <p className="text-sm text-white/80 mb-8 relative z-10">Based on last week's feedback</p>

             <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Spice Balance</span>
                    <span>88%</span>
                  </div>
                  <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                 <div>
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Packaging Quality</span>
                    <span>94%</span>
                  </div>
                  <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/20 relative z-10 italic text-sm text-white/90">
               "The Wednesday Biryani was the highlight of my work week! Please keep it."
               <p className="text-xs font-semibold not-italic mt-2 text-white/70">— Rahul K., Gold Subscriber</p>
             </div>
         </div>
      </div>

    </div>
  );
}
