import React, { useState, useMemo } from 'react';
import { TrendingUp, Star, Clock, UtensilsCrossed, CheckCircle2, Plus, Search, Mail, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Extended subscriber dataset with avatars and phone numbers
const ALL_SUBSCRIBERS = [
  { id: 'EK', name: 'Eleanor Kade',    email: 'eleanor.k@example.com', phone: '+91 98765 43210', plan: 'Monthly',   startDate: 'Oct 12, 2023', status: 'Preparing',        avatar: 'https://i.pravatar.cc/100?img=47' },
  { id: 'MT', name: 'Marcus Thorne',   email: 'm.thorne@web.com',       phone: '+91 87654 32109', plan: 'Weekly',    startDate: 'Nov 02, 2023', status: 'Out for Delivery', avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 'SP', name: 'Sarah Pendergast',email: 'sarah.p@studio.io',      phone: '+91 76543 21098', plan: 'Monthly',   startDate: 'Oct 28, 2023', status: 'Scheduled',        avatar: 'https://i.pravatar.cc/100?img=44' },
  { id: 'JV', name: 'Jameson Vane',    email: 'j.vane@creative.com',    phone: '+91 65432 10987', plan: 'Weekly',    startDate: 'Dec 01, 2023', status: 'Preparing',        avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'AN', name: 'Ananya Sharma',   email: 'ananya.s@mail.com',      phone: '+91 54321 09876', plan: 'Quarterly', startDate: 'Sep 15, 2023', status: 'Scheduled',        avatar: 'https://i.pravatar.cc/100?img=32' },
  { id: 'RV', name: 'Rahul Verma',     email: 'rahul.v@gmail.com',      phone: '+91 43210 98765', plan: 'Monthly',   startDate: 'Aug 20, 2023', status: 'Out for Delivery', avatar: 'https://i.pravatar.cc/100?img=67' },
];

const STATUS_TABS = ['All', 'Preparing', 'Out for Delivery', 'Scheduled'];

const statusConfig = {
  'Preparing':        { color: 'text-rust',           bg: 'bg-rust/10',         dot: 'bg-rust',       icon: UtensilsCrossed },
  'Scheduled':        { color: 'text-ink-secondary',  bg: 'bg-[#EBE9E1]',       dot: 'bg-ink-light',  icon: Clock },
  'Out for Delivery': { color: 'text-green-700',      bg: 'bg-green-50',        dot: 'bg-green-500',  icon: CheckCircle2 },
};

const planConfig = {
  'Monthly':   { color: 'text-green-800',       bg: 'bg-[#CBEBCD]' },
  'Weekly':    { color: 'text-ink-secondary',   bg: 'bg-[#E5E1D6]' },
  'Quarterly': { color: 'text-amber-800',       bg: 'bg-amber-100' },
};

export default function ChefSubscribers() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { chefDashboardAPI } = await import('../../services/api');
        const res = await chefDashboardAPI.getOrders();
        // map backend orders to frontend objects
        const subs = res.data.map(order => ({
            id: order._id,
            name: order.customerId?.name || 'Unknown',
            email: order.customerId?.email || 'N/A',
            phone: order.customerId?.mobile || 'N/A',
            plan: 'Monthly', // Mock mapping
            startDate: new Date(order.date).toLocaleDateString(),
            status: order.status,
            avatar: order.customerId?.avatar || 'https://i.pravatar.cc/100?img=1'
        }));
        setSubscribers(subs.length ? subs : ALL_SUBSCRIBERS); // fallback to mock if empty
      } catch (err) {
        setSubscribers(ALL_SUBSCRIBERS); // fallback if error
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Live filtering
  const filtered = useMemo(() => {
    return subscribers.filter(sub => {
      const q = search.toLowerCase();
      const matchSearch  = !search || sub.name.toLowerCase().includes(q) || sub.email.toLowerCase().includes(q);
      const matchStatus  = statusFilter === 'All' || sub.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, subscribers]);

  const updateStatus = (id, newStatus) => {
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast.success(`Status updated to "${newStatus}"`);
  };

  const sendOffer = (name) => toast.success(`🎉 Special offer sent to ${name}!`);

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">Subscriber Management</h1>
          <p className="text-ink-secondary text-sm">Manage your tiffin subscriptions and maintain culinary relationships.</p>
        </div>

        {/* KPI Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#E4F2E7] px-5 py-2.5 rounded-full flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-green-700" />
            <div>
              <p className="text-[9px] font-bold text-green-800 uppercase tracking-widest leading-none mb-0.5">Active Plans</p>
              <p className="text-lg font-bold text-green-900 leading-none">{subscribers.length}</p>
            </div>
          </div>
          <div className="bg-[#Fdf3e7] px-5 py-2.5 rounded-full flex items-center gap-3 border border-[#FBEAC8]">
            <Star className="w-4 h-4 text-[#B08945]" />
            <div>
              <p className="text-[9px] font-bold text-[#9D7936] uppercase tracking-widest leading-none mb-0.5">Retention</p>
              <p className="text-lg font-bold text-[#8A6729] leading-none">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Filter ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-[#E5E1D6] rounded-2xl text-sm outline-none focus:border-rust/40 focus:ring-2 focus:ring-rust/10 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex bg-[#EBE9E1] rounded-full p-1 gap-1 overflow-x-auto scrollbar-hide shrink-0">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 md:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab ? 'bg-white text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results label */}
      <p className="text-xs text-ink-muted mb-4">
        Showing <span className="text-ink font-bold">{filtered.length}</span> of <span className="text-ink font-bold">{subscribers.length}</span> subscribers
        {statusFilter !== 'All' && <span className="ml-1">· <span className="text-rust font-semibold">{statusFilter}</span></span>}
        {search && <span className="ml-1">· matching "<span className="text-rust">{search}</span>"</span>}
      </p>

      {/* ── Desktop Table ─────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-[#E5E1D6] shadow-sm mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E1D6] bg-black/[0.03]">
                <th className="py-4 px-6 text-[11px] font-bold text-ink-secondary uppercase tracking-widest">Customer</th>
                <th className="py-4 px-6 text-[11px] font-bold text-ink-secondary uppercase tracking-widest">Plan</th>
                <th className="py-4 px-6 text-[11px] font-bold text-ink-secondary uppercase tracking-widest">Since</th>
                <th className="py-4 px-6 text-[11px] font-bold text-ink-secondary uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-ink-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-semibold text-ink mb-1">No subscribers found</p>
                    <p className="text-sm text-ink-muted">Try a different search or filter</p>
                    <button
                      onClick={() => { setSearch(''); setStatusFilter('All'); }}
                      className="mt-4 text-sm text-rust font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : filtered.map((sub) => {
                const sc = statusConfig[sub.status];
                const pc = planConfig[sub.plan];
                const StatusIcon = sc.icon;
                return (
                  <tr key={sub.id} className="border-b border-[#E5E1D6] last:border-none hover:bg-black/[0.02] transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={sub.avatar} alt={sub.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E1D6] shrink-0" />
                        <div>
                          <p className="font-bold text-ink text-sm">{sub.name}</p>
                          <p className="text-xs text-ink-secondary">{sub.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${pc.bg} ${pc.color}`}>
                        {sub.plan}
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="py-4 px-6 text-sm text-ink-secondary font-medium">{sub.startDate}</td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shrink-0`} />
                        <StatusIcon className="w-3 h-3" />
                        {sub.status}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${sub.email}`}
                          title={`Email ${sub.name}`}
                          className="p-2 rounded-xl bg-[#F2F0EA] hover:bg-[#E5E1D6] text-ink-secondary hover:text-ink transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${sub.phone}`}
                          title={`Call ${sub.name}`}
                          className="p-2 rounded-xl bg-[#F2F0EA] hover:bg-[#E5E1D6] text-ink-secondary hover:text-ink transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <select
                          value={sub.status}
                          onChange={e => updateStatus(sub.id, e.target.value)}
                          className="text-xs border border-[#E5E1D6] rounded-xl px-3 py-2 bg-white text-ink font-semibold outline-none focus:border-rust/40 cursor-pointer hover:border-rust/30 transition-colors"
                        >
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Scheduled">Scheduled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ──────────────────────────────────── */}
      <div className="md:hidden space-y-3 mb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E1D6]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-ink mb-1">No subscribers found</p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('All'); }}
              className="mt-2 text-sm text-rust font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : filtered.map(sub => {
          const sc = statusConfig[sub.status];
          const pc = planConfig[sub.plan];
          return (
            <div key={sub.id} className="bg-white rounded-2xl border border-[#E5E1D6] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={sub.avatar} alt={sub.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E1D6]" />
                  <div>
                    <p className="font-bold text-ink text-sm">{sub.name}</p>
                    <p className="text-xs text-ink-secondary">{sub.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${pc.bg} ${pc.color}`}>
                  {sub.plan}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sub.status}
                </div>
                <div className="flex items-center gap-2">
                  <a href={`mailto:${sub.email}`}
                    className="p-2 rounded-xl bg-[#F2F0EA] text-ink-secondary hover:text-ink transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href={`tel:${sub.phone}`}
                    className="p-2 rounded-xl bg-[#F2F0EA] text-ink-secondary hover:text-ink transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                  <select
                    value={sub.status}
                    onChange={e => updateStatus(sub.id, e.target.value)}
                    className="text-xs border border-[#E5E1D6] rounded-xl px-2 py-2 bg-white text-ink font-semibold outline-none focus:border-rust/40 cursor-pointer"
                  >
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-ink-tertiary mt-3 pt-2 border-t border-[#F2F0EA]">
                Subscribed since {sub.startDate} · {sub.phone}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Insights Row ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Growth Bar Chart */}
        <div className="lg:col-span-2 bg-[#F2F0EA] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-2xl font-bold text-ink mb-2">Subscriber Growth</h3>
            <p className="text-sm text-ink-secondary">
              Your base grew by <span className="text-green-700 font-bold">12%</span> this month. Keep up the great work!
            </p>
          </div>
          <div>
            <div className="flex items-end gap-2 h-36 mt-8">
              {[20, 35, 25, 45, 40, 65, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-2xl transition-all hover:brightness-95 cursor-default"
                  style={{
                    height: `${h}%`,
                    background: i === 6
                      ? 'linear-gradient(to top, #E9904E, #C0602F)'
                      : '#E8E2D5',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted mt-2 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>

        {/* Right Alerts */}
        <div className="flex flex-col gap-4">
          {/* Milestone Alert */}
          <div className="bg-[#Fdf3e7] rounded-[2rem] p-6 relative overflow-hidden flex-1">
            <div className="absolute -bottom-8 -right-8 w-28 h-28 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="fill-rust w-full h-full transform -rotate-12">
                <path d="M20 0 L100 80 L100 100 L0 100 Z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-rust mb-2">Milestone Alert</h4>
            <p className="text-sm text-rust/80 leading-relaxed font-medium mb-5">
              Eleanor Kade is reaching her 1-year anniversary as a subscriber next week!
            </p>
            <button
              onClick={() => sendOffer('Eleanor Kade')}
              className="px-5 py-2.5 bg-[#B05B1E] text-white rounded-full text-sm font-bold shadow-md relative z-10 hover:bg-[#9A4516] transition-colors"
            >
              Send Special Offer
            </button>
            <button
              onClick={() => sendOffer('Eleanor Kade')}
              className="absolute right-5 bottom-5 w-11 h-11 rounded-full bg-rust shadow-lg flex items-center justify-center text-white cursor-pointer hover:bg-rust-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Recent Feedback */}
          <div className="bg-[#F2F0EA] rounded-[2rem] p-6">
            <h4 className="text-base font-bold text-ink mb-4">Recent Feedback</h4>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EACC4E] shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold text-ink">MT</div>
              <div>
                <p className="text-sm italic text-ink-secondary mb-2">
                  "The saffron risotto this week was absolutely divine. Best tiffin yet!"
                </p>
                <p className="text-[10px] font-bold text-ink uppercase tracking-widest">— Marcus T.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
