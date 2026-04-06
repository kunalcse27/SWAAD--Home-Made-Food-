import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Shield } from 'lucide-react';
import useStore from '../hooks/useStore';
import { subscriptionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const PLAN_LABELS = { weekly: 'Weekly Plan', monthly: 'Monthly Plan', quarterly: 'Quarterly Plan' };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const [payMode, setPayMode] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });

  if (!cart) {
    navigate('/home');
    return null;
  }

  const { chef, plan, delivery, total } = cart;
  const deliveryFee = delivery === 'home' ? 300 : 0;
  const planPrice = total - deliveryFee;

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Send subscription creation to backend
      const subscriptionData = {
        chefId: chef.id || chef._id,
        planType: plan,
        deliveryOption: delivery,
        isVegOnly: cart.isVegOnly || false,
        totalPrice: total + Math.round(planPrice * 0.05),
        deliveryFee
      };
      await subscriptionsAPI.create(subscriptionData);

      // 2. Simulate payment processing delay
      await new Promise(r => setTimeout(r, 1500));
      
      clearCart();
      toast.success('🎉 Subscription Activated! Your first tiffin arrives tomorrow.');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to create subscription');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const payModes = [
    { key: 'card', icon: <CreditCard size={18} />, label: 'Credit / Debit Card' },
    { key: 'upi', icon: <Smartphone size={18} />, label: 'UPI / PhonePe / GPay' },
    { key: 'netbanking', icon: <Building2 size={18} />, label: 'Net Banking' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="container-app px-4 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-ink-secondary hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-ink font-display mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment mode selector */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <h2 className="font-bold text-ink mb-4">💳 Payment Method</h2>
              <div className="space-y-2">
                {payModes.map(m => (
                  <label key={m.key}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${payMode === m.key ? 'border-primary bg-primary/5' : 'border-surface-muted hover:border-primary/30'}`}>
                    <input type="radio" name="paymode" value={m.key} checked={payMode === m.key}
                      onChange={() => setPayMode(m.key)} className="hidden" />
                    <span className={payMode === m.key ? 'text-primary' : 'text-ink-secondary'}>{m.icon}</span>
                    <span className="text-sm font-medium text-ink">{m.label}</span>
                    {payMode === m.key && <span className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Card form */}
            {payMode === 'card' && (
              <div className="card-flat rounded-2xl p-6 border border-surface-muted space-y-4 animate-fade-in">
                <h2 className="font-bold text-ink mb-2">Card Details</h2>
                <div>
                  <label className="input-label">Card Number</label>
                  <input value={cardForm.number} onChange={e => setCardForm(f => ({ ...f, number: e.target.value }))}
                    placeholder="1234 5678 9012 3456" maxLength={19} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Cardholder Name</label>
                  <input value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Name on card" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Expiry Date</label>
                    <input value={cardForm.expiry} onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))}
                      placeholder="MM / YY" maxLength={7} className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">CVV</label>
                    <input value={cardForm.cvv} onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value }))}
                      type="password" placeholder="• • •" maxLength={4} className="input-field" />
                  </div>
                </div>
              </div>
            )}

            {/* UPI */}
            {payMode === 'upi' && (
              <div className="card-flat rounded-2xl p-6 border border-surface-muted animate-fade-in">
                <h2 className="font-bold text-ink mb-4">UPI Payment</h2>
                <div className="flex flex-wrap gap-3 mb-5">
                  {['📱 GPay', '💜 PhonePe', '🟠 Paytm', '🔵 BHIM'].map(app => (
                    <button key={app} className="px-4 py-2 rounded-full border-2 border-surface-muted bg-white text-sm font-medium hover:border-primary/40 transition-colors">
                      {app}
                    </button>
                  ))}
                </div>
                <label className="input-label">Or enter UPI ID</label>
                <input placeholder="yourname@upi" className="input-field" />
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Shield size={14} className="text-success" />
              256-bit SSL encrypted · Secured by Razorpay · PCI DSS compliant
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-flat rounded-2xl p-6 border border-surface-muted space-y-5">
              <h3 className="font-bold text-ink text-lg">📋 Order Summary</h3>

              {/* Chef card mini */}
              <div className="flex items-center gap-3 p-3 bg-surface-section rounded-xl">
                <img src={chef.image} alt={chef.kitchen} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-ink text-sm">{chef.kitchen}</p>
                  <p className="text-xs text-ink-secondary">{PLAN_LABELS[plan]}</p>
                  <p className="text-xs text-ink-muted">{delivery === 'home' ? '🚚 Home Delivery' : '🏪 Self Pickup'}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-ink-secondary">
                  <span>{PLAN_LABELS[plan]}</span>
                  <span className="font-medium text-ink">₹{planPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>Delivery Charges</span>
                  <span className={deliveryFee === 0 ? 'text-success font-medium' : 'font-medium text-ink'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>GST (5%)</span>
                  <span className="font-medium text-ink">₹{Math.round(planPrice * 0.05).toLocaleString()}</span>
                </div>
                <hr className="border-surface-muted" />
                <div className="flex justify-between font-bold text-base text-ink">
                  <span>Total Payable</span>
                  <span className="text-primary text-lg">₹{(total + Math.round(planPrice * 0.05)).toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handlePay} disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl shadow-glow text-base disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : `💳 Pay ₹${(total + Math.round(planPrice * 0.05)).toLocaleString()}`}
              </button>

              <p className="text-xs text-center text-ink-muted">
                By subscribing you agree to our <a href="#" className="text-primary hover:underline">Terms</a> &amp; <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
