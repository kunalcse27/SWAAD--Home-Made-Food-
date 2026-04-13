import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, CheckCircle2, Clock, TrendingUp, Star, Bike, Bell, IndianRupee, Navigation, Phone } from 'lucide-react';
import useStore from '../../hooks/useStore';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI, deliveryDashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
  'Picking Up':  { color: 'text-amber-600', bg: 'bg-amber-50',          dot: 'bg-amber-400',    icon: Package },
  'On the Way':  { color: 'text-primary',   bg: 'bg-primary/10',        dot: 'bg-primary',       icon: Navigation },
  'Scheduled':   { color: 'text-ink-secondary', bg: 'bg-surface-section', dot: 'bg-ink-light',  icon: Clock },
  'pending':     { color: 'text-amber-600', bg: 'bg-amber-50',          dot: 'bg-amber-400',    icon: Clock },
  'out_for_delivery': { color: 'text-primary', bg: 'bg-primary/10',     dot: 'bg-primary',       icon: Navigation },
  'delivered':   { color: 'text-green-600', bg: 'bg-green-50',          dot: 'bg-green-400',    icon: CheckCircle2 },
};

export default function DeliveryDashboard() {
  const { user, logout } = useStore();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [earningsChart, setEarningsChart] = useState([]);
  const [loading, setLoading] = useState(true);

  // If partner hasn't linked to a chef yet, send them to the join page
  useEffect(() => {
    if (userProfile && !userProfile.linkedChefId) {
      navigate('/partner/join', { replace: true });
    }
  }, [userProfile, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes, earningsRes] = await Promise.all([
        ordersAPI.getDeliveryOrders(),
        deliveryDashboardAPI.getStats(),
        deliveryDashboardAPI.getEarnings()
      ]);
      
      setActiveOrders(ordersRes.data);
      setStats(statsRes.data);
      setEarningsChart(earningsRes.data);
      setIsOnline(statsRes.data.isOnline);
    } catch (err) {
      toast.error('Failed to sync dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    const nextStatus = !isOnline;
    try {
      await deliveryDashboardAPI.updateStatus(nextStatus);
      setIsOnline(nextStatus);
      toast.success(`You are now ${nextStatus ? 'Online' : 'Offline'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success(`Order marked as ${status}`);
      fetchData(); // Refresh everything
    } catch (err) {
      toast.error('Could not update order');
    }
  };

  const todayStats = [
    { label: 'Deliveries Done Today', value: stats?.deliveriesDoneToday?.toString() || '0', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Pending for You', value: stats?.activeOrdersCount?.toString() || '0', icon: Package, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
    { label: 'Earnings (Est.)', value: `₹${stats?.earningsToday || 0}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Zone Status', value: stats?.isOnline ? 'Active' : 'Paused', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-muted shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center shadow-glow">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-ink leading-none">SWAAD Partner</p>
              <p className="text-[10px] text-ink-muted uppercase tracking-widest">Delivery Studio</p>
            </div>
          </div>

          {/* Online Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-ink-muted'}`}>
              {isOnline ? '🟢 Online' : '⚫ Offline'}
            </span>
            <button
              onClick={handleToggleOnline}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-surface-muted'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isOnline ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-ink-secondary hover:text-ink transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-surface-muted">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?img=35'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <button onClick={handleLogout} className="hidden sm:block text-xs text-ink-secondary hover:text-primary transition-colors font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-[#302E2B] via-[#3d3a36] to-[#302E2B] rounded-3xl p-8 mb-8 overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #FF6B2C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #FFB347 0%, transparent 50%)' }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} 👋</p>
              <h1 className="text-3xl font-bold text-white mb-1">
                {user?.name?.split(' ')[0] || 'Partner'}!
              </h1>
              <p className="text-white/70 text-sm">
                You have <span className="text-primary font-bold">{stats?.activeOrdersCount || 0} active deliveries</span> today. Keep rolling! 🛵
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold">{stats?.zone || 'Locating...'}</p>
                <p className="text-white/60 text-xs">Delivery zone active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {todayStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`card-flat rounded-2xl p-5 border ${stat.border}`}>
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-ink">{stat.value}</p>
                <p className="text-xs text-ink-muted font-medium mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-ink">Active Orders</h2>
              <span className="badge-primary text-xs font-bold px-3 py-1">{activeOrders.length} pending</span>
            </div>

            {loading ? (
               <div className="text-center py-10 text-ink-secondary">Loading dispatch routes...</div>
            ) : activeOrders.length === 0 ? (
               <div className="text-center py-10 card">No active orders right now. Grab a chai! ☕</div>
            ) : activeOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig['Scheduled'];
              return (
                <div key={order.id} className="card p-5 cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* Customer Avatar */}
                    <div className="w-11 h-11 rounded-full bg-surface-muted flex items-center justify-center font-bold text-ink-secondary shrink-0">
                      {order.customerName?.charAt(0) || 'U'}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-bold text-ink text-sm">{order.customerName}</p>
                          <p className="text-xs text-ink-muted">{order.chefKitchen}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color} ${config.bg} whitespace-nowrap`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-ink-secondary mb-3">
                        <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="truncate">{order.deliveryAddress || 'Address unavailable'}</span>
                      </div>

                      {/* Action row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-primary font-semibold">
                            <Clock className="w-3 h-3" /> ETA: 20 min
                          </span>
                          <span className="text-ink-muted">{order.distance || '2.5 km'}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-surface-section rounded-xl hover:bg-primary/10 transition-colors text-ink-secondary hover:text-primary">
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`)}
                            className="p-2 bg-primary-gradient text-white rounded-xl shadow-sm hover:shadow-glow hover:scale-105 transition-all">
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar and State Actions */}
                  <div className="mt-4 pt-3 border-t border-surface-muted">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-gradient rounded-full transition-all duration-500"
                          style={{ width: order.status === 'Picking Up' ? '33%' : order.status === 'On the Way' ? '66%' : '10%' }}
                        />
                      </div>
                      <div className="flex gap-2">
                         {order.status === 'Scheduled' && (
                           <button onClick={() => updateStatus(order.id, 'Picking Up')} className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-lg">Pick Up</button>
                         )}
                         {order.status === 'Picking Up' && (
                           <button onClick={() => updateStatus(order.id, 'On the Way')} className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-lg">Start Path</button>
                         )}
                         {order.status === 'On the Way' && (
                           <button onClick={() => updateStatus(order.id, 'Delivered')} className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-3 py-1 rounded-lg">Deliver</button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Earnings Chart Snapshot */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-ink">Earnings History</h3>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-center py-4">
                <p className="text-5xl font-black text-ink">₹{stats?.earningsToday || 0}</p>
                <p className="text-xs text-ink-muted mt-2">Earned today (₹80/delivery)</p>
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-16 mt-4 px-2">
                {Array(7).fill(0).map((_, i) => {
                  const h = earningsChart[i]?.amount / 2 || 20; // scaled
                  return (
                    <div key={i} className="flex-1 rounded-t-lg transition-all"
                      style={{
                        height: `${Math.min(h, 100)}%`,
                        background: i === 6 ? 'linear-gradient(to top, #FF6B2C, #FF8C42)' : '#EDE7E2'
                      }} />
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] text-ink-muted mt-1 px-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'Today'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <h3 className="font-bold text-ink mb-4">Support & Help</h3>
              <div className="space-y-2.5">
                <button className="w-full btn-outline btn-sm">Emergency SOS</button>
                <button className="w-full btn-outline btn-sm">Support Chat</button>
              </div>
            </div>

            {/* Rating snapshot */}
            <div className="bg-ink rounded-2xl p-6 text-white shadow-glow">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <p className="text-sm font-bold">Your Rating</p>
              </div>
              <p className="text-5xl font-black text-white mb-1">{stats?.rating || 4.8}</p>
              <p className="text-white/60 text-xs">Based on {stats?.totalDeliveries || 0} deliveries</p>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/70 italic opacity-80">
                "Consistently fast and handled my food with care."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
