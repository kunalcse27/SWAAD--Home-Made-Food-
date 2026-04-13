import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Heart, Share2, Truck, Store } from 'lucide-react';
import { RatingBadge } from '../components/RatingStars';
import ChefAestheticMenu from '../components/ChefAestheticMenu';
import SubscriptionSelector from '../components/SubscriptionSelector';
import useStore from '../hooks/useStore';
import { chefsAPI } from '../services/api';
import toast from 'react-hot-toast';

const DELIVERY_FEE = 300;

export default function TiffinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted, setCart } = useStore();
  
  const [chef, setChef] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [delivery, setDelivery] = useState('home');
  const [isVegOnly, setIsVegOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [chefRes, menuRes] = await Promise.all([
          chefsAPI.getById(id),
          chefsAPI.getMenu(id)
        ]);
        setChef(chefRes.data);
        setMenu(menuRes.data);
        setIsVegOnly(chefRes.data.isVeg);
      } catch (error) {
        toast.error('Chef not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-surface pt-16 flex items-center justify-center">Loading...</div>;
  }

  const saved = isWishlisted(chef.id);
  const planPrice = { weekly: chef.subscriptions.weekly, monthly: chef.subscriptions.monthly, quarterly: chef.subscriptions.quarterly }[selectedPlan];
  const deliveryFee = delivery === 'home' ? DELIVERY_FEE : 0;
  const total = planPrice + deliveryFee;

  const handleSubscribe = () => {
    setCart({ chef, plan: selectedPlan, delivery, total });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={chef.image} alt={chef.kitchen} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <ArrowLeft size={18} />
        </button>
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => toggleWishlist(chef.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center glass transition-all ${saved ? 'bg-primary text-white' : 'text-white'}`}>
            <Heart size={18} className={saved ? 'fill-white' : ''} />
          </button>
          <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
        {/* Chef info on image */}
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <img src={chef.avatar} alt={chef.name} className="w-16 h-16 rounded-2xl border-3 border-white object-cover shadow-float" />
          <div>
            <h1 className="text-white font-extrabold text-2xl font-display flex items-center gap-2">
              {chef.kitchen}
              {chef.verified && <CheckCircle size={20} className="text-primary fill-primary" />}
            </h1>
            <p className="text-white/80 text-sm">{chef.name} · {chef.experience} experience</p>
          </div>
        </div>
      </div>

      <div className="container-app px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chef Info */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  {chef.isVeg
                    ? <span className="badge-veg">🟢 Veg Menu</span>
                    : <span className="badge-nonveg">🔴 Non-Veg Available</span>}
                  {chef.cuisines.map(c => (
                    <span key={c} className="badge-primary">{c}</span>
                  ))}
                </div>
                <RatingBadge rating={chef.rating} count={chef.reviews} />
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-ink-secondary">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {chef.location}</span>
                <span className="flex items-center gap-1">📍 {chef.distance}</span>
                <span className="flex items-center gap-1">🕐 {chef.meals}</span>
              </div>
              <p className="mt-4 text-ink-secondary text-sm leading-relaxed">
                Experience the authentic taste of homemade food with {chef.name}'s kitchen.
                Specialising in <strong>{chef.specialty}</strong>, every meal is prepared with love,
                fresh ingredients, and traditional recipes passed down through generations.
              </p>
            </div>

            {/* Signature Menu */}
            <div>
              <h2 className="text-xl font-bold text-ink mb-4">✨ Signature Experience</h2>
              <ChefAestheticMenu menu={menu} />
            </div>

            {/* Subscription Plans */}
            <div>
              <h2 className="text-xl font-bold text-ink mb-4">🎯 Subscription Plans</h2>
              <SubscriptionSelector selected={selectedPlan} onChange={setSelectedPlan} />
            </div>

            {/* Meal Customization */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <h2 className="text-xl font-bold text-ink mb-4">⚙️ Meal Customization</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-surface-muted">
                  <div>
                    <p className="font-semibold text-ink text-sm">Veg Only Mode</p>
                    <p className="text-ink-secondary text-xs">All non-veg items will be replaced</p>
                  </div>
                  <button type="button" onClick={() => setIsVegOnly(!isVegOnly)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isVegOnly ? 'bg-success' : 'bg-surface-muted'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isVegOnly ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                {['Avoid Onion & Garlic (Jain)', 'Extra Roti (+₹30/day)', 'Double Portion', 'No Pickle/Papad'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
                    <span className="text-sm text-ink-secondary">{opt}</span>
                  </label>
                ))}
                <textarea placeholder="Any dietary restrictions or special requests..." rows={3}
                  className="input-field mt-2 resize-none text-sm" />
              </div>
            </div>

            {/* Delivery Options */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <h2 className="text-xl font-bold text-ink mb-4">🚚 Delivery Option</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { value: 'home', icon: <Truck size={20} className="text-primary" />, label: 'Home Delivery', sub: `+₹${DELIVERY_FEE}/month extra` },
                  { value: 'pickup', icon: <Store size={20} className="text-primary" />, label: 'Self Pickup', sub: 'Free · Pick up from chef' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                      ${delivery === opt.value ? 'border-primary bg-primary/5' : 'border-surface-muted hover:border-primary/40'}`}>
                    <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value}
                      onChange={() => setDelivery(opt.value)} className="hidden" />
                    {opt.icon}
                    <div>
                      <p className="font-semibold text-ink text-sm">{opt.label}</p>
                      <p className="text-xs text-ink-secondary">{opt.sub}</p>
                    </div>
                    {delivery === opt.value && (
                      <span className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky sidebar Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-flat rounded-2xl p-6 border border-surface-muted space-y-4">
              <h3 className="font-bold text-ink text-lg">📋 Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-secondary">
                  <span>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</span>
                  <span className="font-semibold text-ink">₹{planPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>Delivery ({delivery === 'home' ? 'Home' : 'Pickup'})</span>
                  <span className={delivery === 'pickup' ? 'text-success font-medium' : 'font-semibold text-ink'}>
                    {delivery === 'home' ? `+₹${DELIVERY_FEE}` : 'FREE'}
                  </span>
                </div>
                <hr className="border-surface-muted" />
                <div className="flex justify-between font-bold text-ink text-base">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Plan perks */}
              <div className="bg-surface-section rounded-xl p-3 space-y-1.5">
                {['7-day free trial', 'Cancel anytime', 'Fresh daily meals', 'FSSAI certified chef'].map(p => (
                  <p key={p} className="flex items-center gap-2 text-xs text-ink-secondary">
                    <span className="text-success">✓</span> {p}
                  </p>
                ))}
              </div>

              <button onClick={handleSubscribe} className="btn-primary w-full text-sm py-4 rounded-2xl shadow-glow">
                🍱 Subscribe Now
              </button>
              <p className="text-xs text-center text-ink-muted">
                No hidden charges · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
