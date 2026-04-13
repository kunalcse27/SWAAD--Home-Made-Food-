import { Leaf, Droplet, Flame } from 'lucide-react';

export default function ChefAestheticMenu({ menu }) {
  if (!menu || !menu.title) {
    return (
      <div className="bg-[#F2F0EA] rounded-[2rem] p-8 text-center border border-[#E5E1D6]">
        <p className="text-ink-secondary">The chef is currently curating their next culinary experience.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl font-sans mt-4">
       <div className="bg-[#F2F0EA] rounded-[2rem] p-6 md:p-10 border border-[#E5E1D6]">
          {/* Header */}
          <div className="mb-10 text-center max-w-2xl mx-auto">
             <h2 className="text-[10px] font-bold text-[#D98A52] uppercase tracking-widest mb-3">Signature Experience</h2>
             <h3 className="text-3xl md:text-4xl font-black text-ink mb-4 font-serif italic">{menu.title}</h3>
             <p className="text-sm text-ink-secondary leading-relaxed">{menu.description}</p>
          </div>

          {/* Courses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
             {/* Starter */}
             <div className="bg-[#Fdfcfb] rounded-3xl p-6 border border-[#E5E1D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EBE9E1] rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center justify-between mb-8 z-10 relative">
                   <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Leaf className="w-4 h-4 text-ink-secondary"/></div>
                   <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Prelude</span>
                </div>
                <div className="text-left mt-auto z-10 relative">
                   <h4 className="text-ink font-bold text-lg leading-tight">{menu.starter || 'Chef Selected Starter'}</h4>
                </div>
             </div>

             {/* Main Course */}
             <div className="bg-[#Fdf3e7] rounded-3xl p-8 border border-[#C0602F] shadow-lg flex flex-col justify-between relative overflow-hidden md:-mt-4 md:mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#Fdf3e7] to-[#f8ded1] opacity-50 -z-0"></div>
                <div className="absolute top-0 right-10 bg-[#9A501B] text-white text-[9px] font-bold px-3 py-1.5 rounded-b-lg tracking-widest uppercase z-10 shadow-sm">Main Course</div>
                <div className="flex items-center justify-between mb-8 mt-2 z-10 relative">
                   <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Flame className="w-5 h-5 text-[#C0602F]"/></div>
                </div>
                <div className="text-left mt-auto z-10 relative">
                   <h4 className="text-ink font-black text-2xl leading-tight mb-2">{menu.mainCourse || 'Chef Signature Dish'}</h4>
                   <p className="text-[#C0602F] text-xs font-bold uppercase tracking-widest flex items-center gap-1">Heart of the meal</p>
                </div>
             </div>

             {/* Accompaniments */}
             <div className="bg-[#Fdfcfb] rounded-3xl p-6 border border-[#E5E1D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EBE9E1] rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center justify-between mb-8 z-10 relative">
                   <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Droplet className="w-4 h-4 text-green-700"/></div>
                   <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Pairs With</span>
                </div>
                <div className="text-left mt-auto z-10 relative">
                   <h4 className="text-ink font-bold text-lg leading-tight">{menu.accompaniments || 'Perfectly paired accoutrements'}</h4>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
