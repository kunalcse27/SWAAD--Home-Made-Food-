import React from 'react';
import { ChefHat, Truck, Utensils, ShieldCheck, Clock, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Utensils className="w-8 h-8 text-[#D98A52]" />,
      title: "Choose Your Chef",
      description: "Browse through our curated list of expert home chefs. Each chef brings their own unique style and secret family recipes to your table."
    },
    {
      icon: <ChefHat className="w-8 h-8 text-[#D98A52]" />,
      title: "Select Your Plan",
      description: "Pick a subscription that fits your lifestyle—daily, weekly, or monthly. Customize your spice levels and dietary preferences with ease."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#D98A52]" />,
      title: "Fresh Delivery",
      description: "Our dedicated delivery partners ensure your meal arrives hot and fresh, right at your doorstep, exactly when you need it."
    }
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Verified Hygiene",
      text: "Every kitchen undergoes regular quality and hygiene checks."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "On-Time Service",
      text: "We value your time. Guaranteed delivery within your chosen slot."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Home Cooked",
      text: "No preservatives, no artificial colors—just pure love."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-[#302E2B]">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Seamless Dining, <span className="text-[#D98A52]">Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8C867B] leading-relaxed">
            SWAAD bridges the gap between home-cooked goodness and your busy lifestyle. 
            Here's how we bring the warmth of a home kitchen to your dining table.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-10 bg-white rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#EEECE7]">
              <div className="absolute -top-6 left-10 w-12 h-12 bg-[#302E2B] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:bg-[#D98A52] transition-colors">
                {idx + 1}
              </div>
              <div className="mb-8 p-4 bg-[#FDF8F3] rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-[#8C867B] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="bg-[#302E2B] rounded-[60px] p-12 md:p-24 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D98A52] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D98A52] opacity-10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Why thousands trust SWAAD for their daily meals
              </h2>
              <p className="text-[#C6C0B5] text-lg leading-relaxed mb-10">
                We're more than just a delivery service. We're a community of food lovers dedicated to preserving the art of home cooking.
              </p>
              <button className="px-8 py-4 bg-[#D98A52] hover:bg-[#c27642] text-white rounded-full font-bold transition-all transform hover:scale-105">
                Join the Community
              </button>
            </div>
            
            <div className="grid gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex gap-6 items-start p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-[#D98A52]/20 rounded-xl text-[#D98A52]">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{f.title}</h4>
                    <p className="text-[#C6C0B5]">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to taste the difference?</h2>
          <p className="text-[#8C867B] mb-10">Start your flavor journey today with our curated menus.</p>
          <a href="/home" className="inline-flex items-center gap-2 text-[#D98A52] font-bold text-lg hover:gap-4 transition-all">
            Browse All Menus <span>→</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
