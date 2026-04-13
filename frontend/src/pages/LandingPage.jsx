import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { chefsAPI } from '../services/api';

function HeroSection({ featuredChef }) {
  const [locationInput, setLocationInput] = useState('');
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 bg-[#F9F8F6] overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Decorative blurred blobs to simulate background depth */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#EFD8C8]/60 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#E6D4B8]/40 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-block px-4 py-1.5 bg-[#FFD166] rounded-full text-[#3A2D23] text-xs font-bold tracking-widest uppercase mb-8">
            Authentic Home Flavors
          </div>

          <h1 className="text-5xl md:text-[5rem] md:leading-[1.1] font-bold text-[#2D2D2D] tracking-tight mb-6 font-display">
            Ghar jaisa khana,<br />
            <span className="text-[#AD4924] italic font-serif tracking-normal">ab har jagah</span>
          </h1>

          <p className="text-[#5A5A5A] text-lg mb-8 leading-relaxed max-w-md">
            Experience the warmth of home-cooked rituals. Curated tiffins from master home chefs, delivered with editorial precision to your doorstep.
          </p>

          {/* Location search */}
          <div className="bg-[#EFECE6] p-2 rounded-full flex items-center justify-between max-w-md shadow-sm border border-[#E5E0D8] mb-6">
            <div className="flex items-center gap-3 px-4 flex-1">
              <MapPin size={18} className="text-[#AD4924]" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter delivery location..."
                className="bg-transparent border-none outline-none text-sm text-[#2D2D2D] placeholder:text-[#8D8D8D] w-full"
              />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#C87E4B] hover:bg-[#AD4924] text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap">
              Find Food
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="bg-[#AD4924] hover:bg-[#8F361A] text-white px-7 py-3.5 rounded-full text-sm font-bold transition-colors shadow-md"
            >
              Order Now
            </Link>
            <Link
              to="/chef-signup"
              className="bg-white hover:bg-[#F0EFEC] text-[#2D2D2D] border border-[#E5E0D8] px-7 py-3.5 rounded-full text-sm font-bold transition-colors"
            >
              Become a Chef
            </Link>
          </div>
        </div>


        {/* Right Image/Video Composition */}
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EDEDE4] to-[#F5F2ED] rounded-[3rem] shadow-xl transform rotate-3" />
          
          <div className="relative z-10 w-full h-full rounded-[3rem] shadow-2xl overflow-hidden group">
            {/* Ultra HD Cinematic Cooking Video Loop (Open CDN) */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out mix-blend-multiply"
            >
              <source src="https://upload.wikimedia.org/wikipedia/commons/7/74/Preparation_of_Dosa.webm" type="video/webm" />
            </video>
            
            {/* Elegant vignette overlay to pop text and add premium cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          </div>
          
          {/* Floating Chef Card */}
          {featuredChef && (
            <div className="absolute -left-8 md:-left-16 bottom-16 z-20 bg-white p-5 rounded-3xl shadow-2xl max-w-[280px] animate-bounce-soft">
              <div className="flex items-center gap-3 mb-2">
                <img src={featuredChef.avatar || 'https://i.pravatar.cc/150?img=47'} alt={featuredChef.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-[#2D2D2D] text-xs font-bold">{featuredChef.kitchenName || featuredChef.name}</p>
                  <div className="flex gap-0.5 text-[#FFD166]">
                    <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                  </div>
                </div>
              </div>
              <p className="text-[#5A5A5A] text-xs font-serif italic truncate-2-lines">
                "{featuredChef.bio || 'Grandmother\'s secret masalas, shared with you.'}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  const roles = [
    {
      title: 'Hungry for Home?',
      desc: 'Access thousands of home kitchens and discover authentic regional recipes.',
      btn: 'Login as Customer',
      icon: '🍛',
      primary: false
    },
    {
      title: 'Share Your Magic',
      desc: 'Turn your passion for cooking into a rewarding professional culinary career.',
      btn: 'Join as Home Chef',
      icon: '👨‍🍳',
      primary: true
    },
    {
      title: 'Deliver Happiness',
      desc: 'Flexible hours, great pay, and the joy of delivering a piece of home to someone.',
      btn: 'Become a Partner',
      icon: '🛵',
      primary: false
    }
  ];

  return (
    <section className="bg-[#F9F8F6] pb-24 relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 md:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.title} className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E0D8] flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{role.title}</h3>
              <p className="text-[#5A5A5A] text-sm leading-relaxed mb-8 flex-1">
                {role.desc}
              </p>
              <Link to={role.primary ? '/chef-signup' : '/login'}
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors ${
                  role.primary 
                  ? 'bg-[#C87E4B] text-white hover:bg-[#AD4924]' 
                  : 'bg-white text-[#2D2D2D] border border-[#E5E0D8] hover:bg-[#F9F8F6]'
                }`}>
                {role.btn}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RitualSection() {
  return (
    <section className="bg-[#F9F8F6] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
        {/* Left text */}
        <div className="lg:col-span-2">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6 tracking-tight">
            The SWAAD <br />
            <span className="text-[#AD4924] font-serif italic">Ritual</span>
          </h2>
          <p className="text-[#5A5A5A] text-lg leading-relaxed mb-10">
            We've reimagined the tiffin experience with an editorial eye for detail, quality, and hygiene.
          </p>
          <div className="flex flex-col gap-4">
            <div className="bg-[#E6F0E4] text-[#2E5B2C] px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold">
              <span className="w-5 h-5 bg-[#2E5B2C] text-white rounded-full flex items-center justify-center text-[10px]">✓</span> 
              FSSAI Certified Home Kitchens
            </div>
            <div className="bg-[#FFF3D6] text-[#8C6D1F] px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold">
              <span className="text-base">🍂</span> 
              100% Biodegradable Packaging
            </div>
          </div>
        </div>

        {/* Right grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#EFECE6] rounded-3xl p-8 relative overflow-hidden group">
            <div className="text-[10px] uppercase tracking-widest text-[#8D8D8D] font-bold mb-2">Step 01</div>
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">Plan Your Week</h3>
            <p className="text-[#5A5A5A] text-sm leading-relaxed">Choose from rotating weekly menus. No repeats, only surprises that taste like home.</p>
            <div className="absolute -bottom-6 -right-6 text-8xl opacity-5 group-hover:scale-110 transition-transform">📅</div>
          </div>
          <div className="bg-[#EFECE6] rounded-3xl p-8 relative overflow-hidden group sm:translate-y-8">
            <div className="text-[10px] uppercase tracking-widest text-[#8D8D8D] font-bold mb-2">Step 02</div>
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">Chef Curated</h3>
            <p className="text-[#5A5A5A] text-sm leading-relaxed">Your chef starts preparing your meal from scratch using fresh, local ingredients.</p>
            <div className="absolute -bottom-6 -right-6 text-8xl opacity-5 group-hover:scale-110 transition-transform">👨‍🍳</div>
          </div>
          <div className="bg-[#EFECE6] rounded-3xl p-8 relative overflow-hidden group">
            <div className="text-[10px] uppercase tracking-widest text-[#8D8D8D] font-bold mb-2">Step 03</div>
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">Swift Delivery</h3>
            <p className="text-[#5A5A5A] text-sm leading-relaxed">Hot and fresh, delivered exactly when you need that midday pick-me-up.</p>
            <div className="absolute -bottom-6 -right-6 text-8xl opacity-5 group-hover:scale-110 transition-transform">🛵</div>
          </div>
          <div className="bg-[#EFECE6] rounded-3xl p-8 relative overflow-hidden group sm:translate-y-8">
            <div className="text-[10px] uppercase tracking-widest text-[#8D8D8D] font-bold mb-2">Step 04</div>
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">Enjoy the Ritual</h3>
            <p className="text-[#5A5A5A] text-sm leading-relaxed">Unpack, savor, and feel the love in every bite. Pure alimentary bliss.</p>
            <div className="absolute -bottom-6 -right-6 text-8xl opacity-5 group-hover:scale-110 transition-transform">🍽️</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtistsSection({ chefs }) {
  // Beautiful curated defaults to ensure the landing page always looks premium (Pure Veg)
  const fallbackChefs = [
    {
      id: 'mock-1',
      kitchenName: "Meera's Royal Thali",
      specialty: 'Authentic Rajasthani & Gujarati Feasts',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' // Veg Thali
    },
    {
      id: 'mock-2',
      kitchenName: "The South Kitchen",
      specialty: 'Crispy Dosas & Filter Coffee',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80' // Dosa
    },
    {
      id: 'mock-3',
      kitchenName: "Amma's Rasoi",
      specialty: 'Sattvic Meals & Crispy Samosas',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' // Samosa/Snacks
    }
  ];

  // Use live data if available, otherwise use the beautiful fallbacks
  const displayChefs = (chefs && chefs.length >= 3) ? chefs.slice(0, 3) : fallbackChefs;

  return (
    <section className="bg-[#2B2A28] py-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-rust/5 rounded-full blur-3xl mix-blend-screen" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-[#FFD166]/5 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Meet Our <span className="text-[#AD4924] font-serif italic">Artists</span>
            </h2>
            <p className="text-[#999999] text-base max-w-md leading-relaxed">
              The heart of SWAAD. Dedicated homemakers transforming fresh ingredients into nostalgic culinary masterpieces.
            </p>
          </div>
          <Link to="/home" className="group text-white text-sm font-semibold flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
            View All Chefs <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid (Optimized heights for better visual balance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] lg:auto-rows-[280px]">
          {displayChefs.map((chef, i) => (
            <Link key={chef.id} to={`/tiffin/${chef.id}`} 
              className={`
                ${i === 0 ? 'lg:col-span-1 lg:row-span-1' : i === 1 ? 'lg:col-span-2' : 'lg:col-span-3 lg:row-span-1'} 
                rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-indigo-500/10 shadow-xl
              `}>
              {/* Image Container with precise zooming */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                 <img src={chef.image || fallbackChefs[i%3].image} 
                   alt={chef.kitchenName} 
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform" />
              </div>
              
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 opacity-80 group-hover:opacity-100" />
              
              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="w-8 h-1 bg-[#D98A52] mb-3 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-100" />
                <h3 className="text-white font-bold text-2xl sm:text-3xl mb-1 font-display">{chef.kitchenName || chef.name}</h3>
                <p className="text-white/80 text-sm font-serif italic max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  {chef.specialty || 'Authentic regional flavors prepared with love.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await chefsAPI.getAll();
        setChefs(res.data);
      } catch (err) {
        console.error('Failed to fetch chefs for landing:', err);
      }
    };
    fetchChefs();
  }, []);

  return (
    <main className="bg-[#F9F8F6]">
      <HeroSection featuredChef={chefs[0]} />
      <RolesSection />
      <RitualSection />
      <ArtistsSection chefs={chefs} />
    </main>
  );
}
