import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Utensils, Calendar, Clock, MapPin, Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import useStore from '../hooks/useStore';
import { subscriptionsAPI, ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status visual mapping
  const statusConfig = {
    'active': { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2, text: 'Active Plan' },
    'paused': { color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock, text: 'Paused' },
    'cancelled': { color: 'text-red-700', bg: 'bg-red-100', icon: AlertCircle, text: 'Cancelled' }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'subscriptions') {
        const res = await subscriptionsAPI.getMySubscriptions();
        setSubscriptions(res.data);
      } else {
        const res = await ordersAPI.getMyOrders();
        setOrders(res.data);
      }
    } catch (error) {
      toast.error('Failed to load your ' + activeTab);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseToggle = async (id) => {
    try {
      await subscriptionsAPI.pause(id);
      fetchData(); // reload
    } catch (err) {
      toast.error('Failed to pause/resume');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      try {
        await subscriptionsAPI.cancel(id);
        fetchData();
      } catch (err) {
        toast.error('Failed to cancel');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-[#2D2D2D] mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Foodie'}! 👋
            </h1>
            <p className="text-[#646464]">Manage your tiffin subscriptions and track today's orders.</p>
          </div>
          <button onClick={() => navigate('/home')} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Subscription
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#e2dfd9] pb-px">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'subscriptions' ? 'border-[#AD4924] text-[#AD4924]' : 'border-transparent text-[#646464] hover:text-[#2D2D2D]'
            }`}
          >
            My Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'orders' ? 'border-[#AD4924] text-[#AD4924]' : 'border-transparent text-[#646464] hover:text-[#2D2D2D]'
            }`}
          >
            Order History
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#646464]">
            <Utensils className="animate-bounce mb-2" />
            <p>Loading your kitchen...</p>
          </div>
        )}

        {/* Subscriptions Tab */}
        {!loading && activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {subscriptions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e2dfd9]">
                <Package className="w-12 h-12 text-[#AD4924]/30 mx-auto mb-3" />
                <h3 className="font-bold text-[#2D2D2D] mb-1">No Active Plans</h3>
                <p className="text-sm text-[#646464] mb-4">You aren't subscribed to any chef right now.</p>
                <button onClick={() => navigate('/home')} className="btn-outline">Explore Chefs</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {subscriptions.map(sub => {
                  const sConfig = statusConfig[sub.status] || statusConfig['active'];
                  const Icon = sConfig.icon;
                  return (
                    <div key={sub.id} className="bg-white rounded-2xl p-6 border border-[#e2dfd9] shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <img src={sub.chef?.avatar} alt={sub.chef?.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h3 className="font-bold text-[#2D2D2D]">{sub.chef?.kitchen}</h3>
                            <p className="text-xs text-[#646464]">{sub.chef?.name}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sConfig.bg} ${sConfig.color}`}>
                          <Icon size={14} /> {sConfig.text}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#F9F8F6] p-3 rounded-xl">
                          <p className="text-[10px] uppercase font-bold text-[#646464] mb-1 tracking-widest">Plan</p>
                          <p className="font-semibold text-[#2D2D2D] capitalize">{sub.planType}</p>
                        </div>
                        <div className="bg-[#F9F8F6] p-3 rounded-xl">
                          <p className="text-[10px] uppercase font-bold text-[#646464] mb-1 tracking-widest">Price</p>
                          <p className="font-semibold text-[#2D2D2D]">₹{sub.totalPrice}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#e2dfd9] flex justify-between gap-3">
                        {sub.status !== 'cancelled' && (
                          <button 
                            onClick={() => handlePauseToggle(sub.id)}
                            className="flex-1 py-2 text-sm font-semibold text-[#2D2D2D] border border-[#e2dfd9] rounded-xl hover:bg-[#F9F8F6] transition-colors"
                          >
                            {sub.status === 'paused' ? 'Resume Plan' : 'Pause Plan'}
                          </button>
                        )}
                        {sub.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(sub.id)}
                            className="flex-1 py-2 text-sm font-semibold text-red-600 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {!loading && activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e2dfd9]">
                <Clock className="w-12 h-12 text-[#AD4924]/30 mx-auto mb-3" />
                <h3 className="font-bold text-[#2D2D2D] mb-1">No Orders Yet</h3>
                <p className="text-sm text-[#646464]">Your upcoming tiffins will appear here.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-4 border border-[#e2dfd9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F9F8F6] rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-[#AD4924]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2D2D]">{order.chefKitchen}</p>
                      <p className="text-xs text-[#646464]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#2D2D2D]">₹{order.totalPrice}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-[#F9F8F6] text-[#646464]'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
