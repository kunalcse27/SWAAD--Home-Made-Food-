import { Share, CalendarDays, Award, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import useStore from '../../hooks/useStore';

export default function ChefProfile() {
  const { user } = useStore();

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans overflow-hidden">
      
      {/* Massive Hero Block */}
      <div className="relative -mt-8 -mx-8 bg-black mb-12 h-96 shrink-0">
         {/* Background Banner */}
         <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Kitchen Background" />
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F6] via-[#F9F8F6]/20 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#F9F8F6] via-transparent to-transparent opacity-80 decoration-overlay"></div>

         {/* Content inside Hero */}
         <div className="absolute bottom-8 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex items-end gap-6 z-10">
               {/* Portrait */}
               <div className="relative">
                 <img src={user?.avatar || "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop"} 
                      className="w-48 h-48 rounded-[2rem] object-cover border-8 border-[#F9F8F6] shadow-2xl" alt="Chef Portrait" />
                 <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-green-700 rounded-full border-4 border-[#F9F8F6] flex items-center justify-center text-white">
                    <CheckCircle2 className="w-5 h-5"/>
                 </div>
               </div>
               
               {/* Title Info */}
               <div className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-[#EACC4E] text-ink-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Master Chef</span>
                     <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#EACC4E] text-[#EACC4E]" />)}
                     </div>
                  </div>
                  <h1 className="text-5xl font-black text-ink tracking-tight mb-2">Chef {user?.name || 'Kabir Singh'}</h1>
                  <p className="text-ink-secondary text-sm max-w-sm leading-relaxed">Specializing in Progressive Mughlai, & Punjabi Heritage</p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pb-4">
               <button className="flex items-center gap-2 px-6 py-3 bg-white text-ink border border-[#E5E1D6] rounded-full font-bold text-sm shadow-sm hover:bg-black/5 transition-colors">
                  <Share className="w-4 h-4"/> Share Profile
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-[#D98A52] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#c27642] transition-colors">
                  <CalendarDays className="w-4 h-4"/> Book a Table
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
             {/* My Story */}
             <div className="bg-[#Fdfcfb] border border-[#E5E1D6] rounded-[2rem] p-8">
                <h3 className="text-2xl font-bold text-rust mb-6">My Story</h3>
                <div className="space-y-4 text-sm text-ink-secondary leading-relaxed">
                   <p>With over two decades spent in the royal kitchens of Lucknow and modern bistros in London, my culinary philosophy is a bridge between ancestral spice secrets and contemporary plating techniques. Every dish I prepare is a manuscript of my travels, etched in saffron and hickory smoke.</p>
                   <p>I believe that food is the ultimate alimentary connector. My 'Tiffin Tales' series focuses on bringing the gravitas of a multi-course royal feast into the intimate setting of your home table.</p>
                </div>

                {/* KPI stats inline */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                   <div className="bg-[#EBE9E1] rounded-2xl p-6 text-center">
                     <h2 className="text-3xl font-black text-ink mb-1">12+</h2>
                     <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest">Years Experience</p>
                   </div>
                   <div className="bg-[#EBE9E1] rounded-2xl p-6 text-center">
                     <h2 className="text-3xl font-black text-ink mb-1">4.9</h2>
                     <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest">User Rating</p>
                   </div>
                   <div className="bg-[#EBE9E1] rounded-2xl p-6 text-center">
                     <h2 className="text-3xl font-black text-ink mb-1">850+</h2>
                     <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest">Tables Hosted</p>
                   </div>
                </div>
             </div>

             {/* Cuisine Specialties Pill Grid */}
             <div>
                <h3 className="font-bold text-ink mb-4">Cuisine Specialties</h3>
                <div className="flex flex-wrap gap-3">
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">Mughlai</span>
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">Punjabi Heritage</span>
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">Awadhi Dum Pukht</span>
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">North Indian Fusion</span>
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">Persian Influence</span>
                   <span className="px-5 py-2 bg-[#CBEBCD] text-green-800 rounded-full text-xs font-bold">Gourmet Grills</span>
                </div>
             </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
             {/* Certifications Block */}
             <div className="bg-[#F2F0EA] rounded-[2rem] p-8">
                <div className="flex items-center gap-2 mb-6 text-ink">
                  <Award className="w-5 h-5 text-rust" />
                  <h3 className="font-bold text-lg">Certifications</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl flex items-start gap-4 shadow-sm border border-[#E5E1D6]">
                     <div className="w-10 h-10 rounded-lg bg-[#F2F0EA] flex items-center justify-center shrink-0">
                       <Award className="w-5 h-5 text-ink-secondary" />
                     </div>
                     <div>
                       <h4 className="text-xs font-bold text-ink">FSSAI Certified Professional</h4>
                       <p className="text-[9px] text-ink-tertiary uppercase mt-1 tracking-wider">Registration: #21223400500129</p>
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl flex items-start gap-4 shadow-sm border border-[#E5E1D6]">
                     <div className="w-10 h-10 rounded-lg bg-[#F2F0EA] flex items-center justify-center shrink-0">
                       <Award className="w-5 h-5 text-ink-secondary" />
                     </div>
                     <div>
                       <h4 className="text-xs font-bold text-ink">Le Cordon Bleu, London</h4>
                       <p className="text-[9px] text-ink-tertiary uppercase mt-1 tracking-wider">Advanced Diploma in Culinary Arts</p>
                     </div>
                  </div>
                   <div className="bg-white p-4 rounded-xl flex items-start gap-4 shadow-sm border border-[#E5E1D6]">
                     <div className="w-10 h-10 rounded-lg bg-[#F2F0EA] flex items-center justify-center shrink-0">
                       <Award className="w-5 h-5 text-ink-secondary" />
                     </div>
                     <div>
                       <h4 className="text-xs font-bold text-ink">HACCP Compliance</h4>
                       <p className="text-[9px] text-ink-tertiary uppercase mt-1 tracking-wider">Food Safety Management System</p>
                     </div>
                  </div>
                </div>
             </div>

             {/* Signature Gallery Feature Block */}
             <div className="bg-[#9A501B] rounded-[2rem] p-8 relative overflow-hidden text-white shadow-xl">
                {/* Abstract Book Graphic built with css */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 pointer-events-none">
                   <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13ZM4 19.5V21h16v-1.5H6.5A2.5 2.5 0 0 0 4 19.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Signature Gallery</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-6 font-medium relative z-10">Explore the visual artistry of Kabir's most requested masterpieces.</p>
                <button className="bg-white text-[#9A501B] px-5 py-2.5 rounded-full text-xs font-bold shadow-md relative z-10 hover:bg-black/5 transition-colors">
                  View 24 Photos
                </button>
             </div>
          </div>
      </div>

      {/* Signature Creations - Horizontal List */}
      <div className="mb-16">
         <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-1">Signature Creations</h2>
              <p className="text-sm text-ink-secondary">Curated highlights from the current seasonal menu.</p>
            </div>
            <button className="text-rust font-bold text-sm flex items-center gap-1 hover:text-rust-dark transition-colors">
               View Full Menu <ChevronRight className="w-4 h-4"/>
            </button>
         </div>
         
         <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-8">
             {/* Card 1 */}
             <div className="relative w-64 h-80 rounded-3xl overflow-hidden shrink-0 snap-start bg-black group cursor-pointer shadow-lg">
                <img src="https://images.unsplash.com/photo-1544025162-831ea2db30b5?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="dish1"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                   <h3 className="text-white font-bold">Nawabi Seekh</h3>
                </div>
             </div>
             {/* Card 2 */}
             <div className="relative w-64 h-80 rounded-3xl overflow-hidden shrink-0 snap-start bg-black group cursor-pointer shadow-lg">
                <img src="https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="dish2"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#B08945]/90 to-transparent opacity-80 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-6">
                   <span className="text-[#EACC4E] text-[10px] font-bold text-center mt-4 tracking-widest uppercase">Nizami Safe Work</span>
                   <h3 className="text-white font-bold text-center">Dum Biryani</h3>
                </div>
             </div>
             {/* Card 3 */}
             <div className="relative w-64 h-80 rounded-3xl overflow-hidden shrink-0 snap-start bg-black group cursor-pointer shadow-lg">
                <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="dish3"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                   <h3 className="text-white font-bold">Saffron Paneer</h3>
                </div>
             </div>
              {/* Card 4 */}
             <div className="relative w-64 h-80 rounded-3xl overflow-hidden shrink-0 snap-start bg-black group cursor-pointer shadow-lg">
                <img src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="dish4"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                   <h3 className="text-white font-bold">Kachori Truffle</h3>
                </div>
             </div>
         </div>
      </div>

      {/* The Tiffin Experience details */}
      <div className="bg-[#F2F0EA] rounded-[2rem] p-10">
         <div className="mb-10 max-w-lg">
            <h2 className="text-2xl font-bold text-ink mb-2">The Tiffin Experience</h2>
            <p className="text-sm text-ink-secondary leading-relaxed">My signature 3-step delivery process designed to preserve the aromatic integrity of Mughlai cuisine.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border-t-8 border-[#3D6343] shadow-sm">
               <div className="w-10 h-10 rounded-full bg-[#3D6343] text-white flex items-center justify-center font-bold text-sm mb-6">1</div>
               <h4 className="text-lg font-bold text-ink mb-2">Clay Handi Prep</h4>
               <p className="text-xs text-ink-secondary leading-relaxed">Food is cooked and sealed in traditional porous earthenware to maintain moisture.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border-t-8 border-[#965A27] shadow-sm">
               <div className="w-10 h-10 rounded-full bg-[#965A27] text-white flex items-center justify-center font-bold text-sm mb-6">2</div>
               <h4 className="text-lg font-bold text-ink mb-2">Aromatic Insulation</h4>
               <p className="text-xs text-ink-secondary leading-relaxed">Double-walled brass tiffins used for transit to ensure temperature stability.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border-t-8 border-[#D98A52] shadow-sm">
               <div className="w-10 h-10 rounded-full bg-[#D98A52] text-white flex items-center justify-center font-bold text-sm mb-6">3</div>
               <h4 className="text-lg font-bold text-ink mb-2">Chef's Final Garnish</h4>
               <p className="text-xs text-ink-secondary leading-relaxed">Separate temperings provided to be added just before you serve.</p>
            </div>
         </div>
      </div>

    </div>
  );
}
