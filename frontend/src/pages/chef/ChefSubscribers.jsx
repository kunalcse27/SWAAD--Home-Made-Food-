import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Star, Clock, UtensilsCrossed, CheckCircle2, Search, Mail, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { chefDashboardAPI } from '../../services/api';

const STATUS_TABS = ['All', 'Preparing', 'Out for Delivery', 'Scheduled'];

const statusConfig = {
  'Preparing':        { color: 'text-rust',           bg: 'bg-rust/10',         dot: 'bg-rust',       icon: UtensilsCrossed },
  'Scheduled':        { color: 'text-ink-secondary',  bg: 'bg-[#EBE9E1]',       dot: 'bg-ink-light',  icon: Clock },
  'Out for Delivery': { color: 'text-green-700',      bg: 'bg-green-50',        dot: 'bg-green-500',  icon: CheckCircle2 },
  'active':           { color: 'text-rust',           bg: 'bg-rust/10',         dot: 'bg-rust',       icon: UtensilsCrossed }, // Fallback for raw DB status
};

const planConfig = {
  'monthly':   { color: 'text-green-800',       bg: 'bg-[#CBEBCD]' },
  'weekly':    { color: 'text-ink-secondary',   bg: 'bg-[#E5E1D6]' },
  'quarterly': { color: 'text-amber-800',       bg: 'bg-amber-100' },
  'Daily':     { color: 'text-ink-secondary',   bg: 'bg-[#EBE9E1]' },
};

export default function ChefSubscribers() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await chefDashboardAPI.getSubscribers();
        setSubscribers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch subscribers:', err);
        toast.error('Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const filtered = useMemo(() => {
    return subscribers.filter(sub => {
      const q = search.toLowerCase();
      const nameMatch = (sub.customerName || '').toLowerCase().includes(q);
      const emailMatch = (sub.customerEmail || '').toLowerCase().includes(q);
      const matchSearch = !search || nameMatch || emailMatch;
      
      const normalizedStatus = sub.status === 'active' ? 'Preparing' : sub.status;
      const matchStatus = statusFilter === 'All' || normalizedStatus === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, subscribers]);

  const sendOffer = (name) => toast.success(`🎉 Special offer sent to ${name}!`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">Subscriber Management</h1>
          <p className="text-ink-secondary text-sm">Manage your active subscriptions and culinary relationships.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#E4F2E7] px-5 py-2.5 rounded-full flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-green-700" />
            <div>
              <p className="text-[9px] font-bold text-green-800 uppercase tracking-widest leading-none mb-0.5">Active Plans</p>
              <p className="text-lg font-bold text-green-900 leading-none">{subscribers.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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

      <p className="text-xs text-ink-muted mb-4">
        Showing <span className="text-ink font-bold">{filtered.length}</span> subscribers
      </p>

      {/* Desktop Table */}
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
                    <p className="font-semibold text-ink mb-1">No subscribers found</p>
                    <p className="text-sm text-ink-muted">Try a different search or filter</p>
                  </td>
                </tr>
              ) : filtered.map((sub) => {
                const displayStatus = sub.status === 'active' ? 'Preparing' : sub.status;
                const sc = statusConfig[displayStatus] || statusConfig['Scheduled'];
                const pc = planConfig[sub.planType?.toLowerCase()] || planConfig['monthly'];
                const StatusIcon = sc.icon;
                
                return (
                  <tr key={sub.id} className="border-b border-[#E5E1D6] last:border-none hover:bg-black/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={sub.customerAvatar || 'https://i.pravatar.cc/100'} alt={sub.customerName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E1D6] shrink-0" />
                        <div>
                          <p className="font-bold text-ink text-sm">{sub.customerName}</p>
                          <p className="text-xs text-ink-secondary">{sub.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${pc.bg} ${pc.color}`}>
                        {sub.planType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-ink-secondary font-medium">
                      {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shrink-0`} />
                        <StatusIcon className="w-3 h-3" />
                        {displayStatus}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`mailto:${sub.customerEmail}`} className="p-2 rounded-xl bg-[#F2F0EA] hover:bg-[#E5E1D6] text-ink-secondary hover:text-ink transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 mb-8">
        {filtered.map(sub => {
          const displayStatus = sub.status === 'active' ? 'Preparing' : sub.status;
          const sc = statusConfig[displayStatus] || statusConfig['Scheduled'];
          const pc = planConfig[sub.planType?.toLowerCase()] || planConfig['monthly'];
          return (
            <div key={sub.id} className="bg-white rounded-2xl border border-[#E5E1D6] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={sub.customerAvatar || 'https://i.pravatar.cc/100'} alt={sub.customerName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E1D6]" />
                  <div>
                    <p className="font-bold text-ink text-sm">{sub.customerName}</p>
                    <p className="text-xs text-ink-secondary">{sub.customerEmail}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${pc.bg} ${pc.color}`}>
                  {sub.planType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {displayStatus}
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${sub.customerEmail}`} className="p-2 rounded-xl bg-[#F2F0EA] text-ink-secondary hover:text-ink transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
