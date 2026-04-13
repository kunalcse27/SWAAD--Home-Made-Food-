import { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Download, CheckCircle, Clock } from 'lucide-react';
import { chefDashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ChefEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [earningsRes, statsRes] = await Promise.all([
          chefDashboardAPI.getEarnings(),
          chefDashboardAPI.getStats(),
        ]);
        setEarnings(earningsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalEarnings       = earnings?.totalEarnings || 0;
  const activeSubscribers   = stats?.totalSubscribers || 0;
  const monthlyData         = earnings?.monthlyData || [];
  const planBreakdown       = earnings?.planBreakdown || {};

  // Calculate next payout date (e.g., next Friday)
  const getNextPayoutDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + (5 + 7 - d.getDay()) % 7 || 7);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-2 font-inter">Financial Performance</h2>
          <h1 className="text-4xl font-bold text-ink">Earnings Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-[#E5E1D6] flex items-center justify-center text-ink-secondary hover:bg-[#D4CEBF] transition-colors">
             <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E1D6]">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-2">Total Earnings</p>
            <h2 className="text-5xl font-black text-ink tracking-tight">₹{totalEarnings.toLocaleString('en-IN')}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-700">
               <TrendingLine />
               <span>Live from Backend</span>
            </div>
         </div>

         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E1D6]">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-2">Active Subscribers</p>
            <h2 className="text-5xl font-black text-ink tracking-tight">{activeSubscribers}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-ink-secondary">
               <span>Currently subscribed</span>
            </div>
         </div>

         <div className="bg-[#305536] rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-between cursor-pointer hover:bg-[#25422A] transition-colors">
            <div>
              <p className="text-[10px] font-bold text-green-300 uppercase tracking-widest mb-2">Next Payout</p>
              <h2 className="text-5xl font-black tracking-tight mb-1">{getNextPayoutDate()}</h2>
            </div>
            <div className="flex items-center justify-between text-sm mt-4">
              <span className="text-green-100/80">Pending settlement</span>
              <ArrowRight className="w-5 h-5 text-green-300" />
            </div>
         </div>
      </div>

      {/* Monthly Revenue Chart placeholder */}
      <div className="bg-[#F2F0EA] rounded-[2rem] p-8 mb-8 relative overflow-hidden">
         <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-2xl font-bold text-ink mb-1">Monthly Revenue</h3>
              <p className="text-sm text-ink-secondary">Breakdown of earnings over the last few months</p>
            </div>
         </div>

         <div className="flex items-end gap-4 h-48">
            {monthlyData.length > 0 ? (
              monthlyData.map((d, i) => {
                const max = Math.max(...monthlyData.map(x => x.amount), 1);
                const height = (d.amount / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-rust rounded-t-lg transition-all hover:brightness-110" style={{ height: `${height}%` }}></div>
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase truncate w-full text-center">{d.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center text-ink-tertiary italic">No monthly data available yet</div>
            )}
         </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-[2rem] border border-[#E5E1D6] shadow-sm mb-8 overflow-hidden">
        <div className="p-8 border-b border-[#E5E1D6]">
          <h3 className="text-xl font-bold text-ink">Earnings Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-[#E5E1D6]">
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Category</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Metric</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(planBreakdown).filter(([,v]) => v > 0).map(([plan, amt]) => (
                <tr key={plan} className="border-b border-[#E5E1D6] last:border-none hover:bg-black/[0.02]">
                  <td className="py-5 px-8">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F2F0EA] text-ink-secondary uppercase">{plan} Plan</span>
                  </td>
                  <td className="py-5 px-8 text-sm text-ink-secondary">Total revenue from {plan} subscriptions</td>
                  <td className="py-5 px-8 text-right font-bold text-lg text-ink">₹{amt.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {Object.keys(planBreakdown).length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-ink-secondary italic">No subscription earnings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white border border-[#E5E1D6] rounded-[2rem] p-8 flex items-center gap-8 shadow-sm">
           <div className="w-24 h-24 rounded-full bg-[#F2F0EA] flex items-center justify-center shrink-0">
              <Lightbulb className="w-10 h-10 text-[#B08945]" />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-bold text-[#B08945] uppercase tracking-widest">Earnings Insight</span>
              </div>
              <h4 className="text-xl font-bold text-ink mb-2">Maximize Subscription Value</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                 Based on current trends, offering a quarterly discount can increase your long-term subscriber retention by up to 30%.
              </p>
           </div>
        </div>

        <div className="bg-gradient-to-br from-[#D47133] to-[#BC591D] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2 relative z-10">Expand Your Kitchen</h3>
            <p className="text-sm text-white/80 leading-relaxed relative z-10">
              Share your passion with other chefs. When they join SWAAD using your referral, you both earn exclusive platform benefits.
            </p>
        </div>
      </div>

      {/* Payout Milestone Stepper */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-ink mb-8">Payout Milestone Trail</h3>
        <div className="flex items-center w-full relative">
           <div className="absolute top-6 left-12 right-12 h-0.5 bg-[#E5E1D6] -z-10"></div>
           <div className="absolute top-6 left-12 w-[60%] h-0.5 bg-green-700 -z-10"></div>
           
           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-green-700 rounded-full text-white flex items-center justify-center border-4 border-[#F9F8F6]">
                 <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink">Earnings Verified</p>
           </div>

           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-green-700 rounded-full text-white flex items-center justify-center border-4 border-[#F9F8F6]">
                 <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink">Platform Cleared</p>
           </div>

           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#FBEAC8] rounded-full text-[#9D7936] flex items-center justify-center border-4 border-[#F9F8F6]">
                 <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink">Processing Transfer</p>
           </div>

           <div className="flex-1 flex flex-col items-center text-center gap-3 opacity-50">
              <div className="w-12 h-12 bg-[#E5E1D6] rounded-full text-ink-secondary flex items-center justify-center border-4 border-[#F9F8F6]">
                 <div className="w-4 h-4 bg-ink-tertiary rounded-[4px]"></div>
              </div>
              <p className="text-xs font-bold text-ink">Settled</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function TrendingLine() {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 10.5L7.5 4.5L12 8L22.5 1.5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 1.5H22.5V7.5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
