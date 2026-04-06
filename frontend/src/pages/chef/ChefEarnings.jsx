import { ArrowRight, Lightbulb, Copy, Download, CheckCircle, Clock } from 'lucide-react';
import { chefLedger } from '../../utils/mockData';

export default function ChefEarnings() {
  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-2 font-inter">Financial Performance</h2>
          <h1 className="text-4xl font-bold text-ink">Earnings Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-white rounded-full p-1 shadow-sm border border-[#E5E1D6]">
            <button className="px-6 py-1.5 rounded-full text-sm font-bold text-ink bg-[#Fdfbfc] shadow-sm">Weekly</button>
            <button className="px-6 py-1.5 rounded-full text-sm font-medium text-ink-secondary hover:text-ink">Monthly</button>
            <button className="px-6 py-1.5 rounded-full text-sm font-medium text-ink-secondary hover:text-ink">Yearly</button>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#E5E1D6] flex items-center justify-center text-ink-secondary hover:bg-[#D4CEBF] transition-colors">
             <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* Total Earnings */}
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E1D6]">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-2">Total Earnings</p>
            <h2 className="text-5xl font-black text-ink tracking-tight bg-clip-text">$12,840.5</h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-700">
               <TrendingLine />
               <span>+14.2% from last month</span>
            </div>
         </div>

         {/* Active Subscriptions */}
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E1D6]">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-2">Active Subscriptions</p>
            <h2 className="text-5xl font-black text-ink tracking-tight">148</h2>
            <div className="mt-4 flex items-center gap-3">
               <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white relative z-30" alt="sb1"/>
                  <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white relative z-20" alt="sb2"/>
                  <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-white relative z-10" alt="sb3"/>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#CCEDD2] text-green-800 text-[10px] font-bold flex items-center justify-center relative z-0">
                     +12
                  </div>
               </div>
               <span className="text-xs text-ink-secondary">New this week</span>
            </div>
         </div>

         {/* Next Payout */}
         <div className="bg-[#305536] rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-between cursor-pointer hover:bg-[#25422A] transition-colors">
            <div>
              <p className="text-[10px] font-bold text-green-300 uppercase tracking-widest mb-2">Next Payout</p>
              <h2 className="text-5xl font-black tracking-tight mb-1">Oct 24</h2>
            </div>
            <div className="flex items-center justify-between text-sm mt-4">
              <span className="text-green-100/80">Estimated: $2,105.00</span>
              <ArrowRight className="w-5 h-5 text-green-300" />
            </div>
         </div>
      </div>

      {/* SVG Growth Revenue Chart Component */}
      <div className="bg-[#F2F0EA] rounded-[2rem] p-8 mb-8 relative overflow-hidden">
         <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-2xl font-bold text-ink mb-1">Growth Revenue</h3>
              <p className="text-sm text-ink-secondary">Visualizing your culinary influence over time</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-rust"></div>
                 <span className="text-[10px] font-bold text-ink uppercase tracking-widest">Net Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green-700"></div>
                 <span className="text-[10px] font-bold text-ink uppercase tracking-widest">Gross Sales</span>
               </div>
            </div>
         </div>

         {/* Beautiful bespoke SVG Area Chart */}
         <div className="w-full h-48 relative">
           {/* Grid lines */}
           <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-ink/5 w-full h-0"></div>
              <div className="border-b border-ink/5 w-full h-0"></div>
              <div className="border-b border-ink/5 w-full h-0"></div>
              <div className="border-b border-ink/5 w-full h-0"></div>
           </div>
           
           <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
             <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#C0602F" stopOpacity="0.2"/>
                   <stop offset="100%" stopColor="#C0602F" stopOpacity="0"/>
                </linearGradient>
             </defs>
             
             {/* Gross Sales (Green Dotted Line) */}
             <path 
                d="M 0 150 C 200 130, 300 100, 500 120 C 600 130, 700 150, 800 90 L 1000 80" 
                fill="none" stroke="#2F5C3B" strokeWidth="2" strokeDasharray="6 4" 
             />

             {/* Net Revenue (Rust Solid Line with Area) */}
             {/* Path: Move to start, Curve to points, Line to bottom right, Line to bottom left, Close */}
             <path 
                d="M 0 130 C 200 110, 300 80, 500 100 C 600 110, 700 130, 800 70 L 1000 60 L 1000 200 L 0 200 Z" 
                fill="url(#curveGradient)" 
             />
             <path 
                d="M 0 130 C 200 110, 300 80, 500 100 C 600 110, 700 130, 800 70 L 1000 60" 
                fill="none" stroke="#C0602F" strokeWidth="3" 
             />
             {/* Data Point Dots */}
             <circle cx="800" cy="70" r="5" fill="white" stroke="#C0602F" strokeWidth="3" />
             <circle cx="1000" cy="60" r="4" fill="#C0602F" />
           </svg>

           {/* X Axis Labels */}
           <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[10px] font-bold text-ink-tertiary uppercase tracking-widest pl-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
         </div>
      </div>

      {/* Resuable Table Container for ledger */}
       <div className="bg-white rounded-[2rem] border border-[#E5E1D6] shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-[#E5E1D6]">
          <h3 className="text-xl font-bold text-ink">Recent Activity</h3>
          <button className="text-sm font-bold text-rust hover:text-rust-dark flex items-center gap-1">
             View Detailed Ledger <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-[#E5E1D6]">
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest w-1/4">Customer / ID</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest w-1/3">Menu Item</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Date</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Status</th>
                <th className="py-4 px-8 text-[10px] font-bold text-ink-secondary uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {chefLedger.map((tx) => (
                <tr key={tx.id} className="border-b border-[#E5E1D6] last:border-none hover:bg-black/5 transition-colors">
                  <td className="py-5 px-8">
                     <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-[#E5E1D6] flex items-center justify-center font-bold text-xs text-ink-secondary">
                          {tx.customer.split(' ').map(n=>n[0]).join('')}
                       </div>
                       <div>
                         <p className="font-bold text-ink text-sm">{tx.customer}</p>
                         <p className="text-[10px] text-ink-tertiary">#{tx.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-ink">{tx.item}</td>
                  <td className="py-5 px-8 text-sm text-ink-secondary">{tx.date}</td>
                  <td className="py-5 px-8">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                        tx.status === 'COMPLETED' ? 'bg-[#E4F2E7] text-green-800' : 'bg-[#FBEAC8] text-[#9D7936]'
                     }`}>
                       {tx.status}
                     </span>
                  </td>
                  <td className="py-5 px-8 text-right font-bold text-lg text-ink">
                     {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Row & Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Growth Insight Card */}
        <div className="bg-white border border-[#E5E1D6] rounded-[2rem] p-8 flex items-center gap-8 shadow-sm">
           <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300" className="w-32 h-32 rounded-full object-cover shadow-sm bg-black" alt="insight"/>
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Lightbulb className="w-4 h-4 text-[#B08945]" />
                 <span className="text-[10px] font-bold text-[#B08945] uppercase tracking-widest">Growth Insight</span>
              </div>
              <h4 className="text-xl font-bold text-ink mb-2">Optimize for Weekends</h4>
              <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                 Your data shows a 24% spike in luxury bundles on Friday evenings. Consider a 'Weekend Feast' premium add-on to maximize earnings.
              </p>
              <button className="px-5 py-2 bg-[#302E2B] text-white text-xs font-bold rounded-full hover:bg-black transition-colors">Apply Strategy</button>
           </div>
        </div>

        {/* Refer a Fellow Chef */}
        <div className="bg-gradient-to-br from-[#D47133] to-[#BC591D] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-center">
            {/* Massive fade out text for structure */}
            <h1 className="absolute -top-10 -right-4 text-9xl font-black text-white/5 pointer-events-none select-none tracking-tighter">CHEF</h1>
            <h3 className="text-2xl font-bold mb-2 relative z-10">Refer a Fellow Chef</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6 w-3/4 relative z-10">
              Expand the Alimentary community and earn 5% of their first month's gross earnings.
            </p>
            <div className="flex items-center bg-white/20 p-1 pl-4 pr-1 inline-block w-fit rounded-full backdrop-blur-sm border border-white/30 relative z-10">
               <span className="text-xs font-bold tracking-widest uppercase mr-4">ALIMENTARY-CHEF-JULIAN</span>
               <button className="w-8 h-8 bg-white text-[#C0602F] rounded-full flex items-center justify-center hover:scale-105 transition-transform"><Copy className="w-3 h-3 hover:scale-110"/></button>
            </div>
        </div>
      </div>

      {/* Payout Milestone Trail Stepper */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-ink mb-8">Payout Milestone Trail</h3>
        <div className="flex items-center w-full relative">
           {/* Connecting Line Base */}
           <div className="absolute top-6 left-12 right-12 h-0.5 bg-[#E5E1D6] -z-10"></div>
           {/* Connecting Line Active */}
           <div className="absolute top-6 left-12 w-[60%] h-0.5 bg-green-700 -z-10"></div>
           
           {/* Step 1 */}
           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-green-700 rounded-full text-white flex items-center justify-center border-4 border-[#F9F8F6]">
                 <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-xs font-bold text-ink">Earnings Calculated</p>
              </div>
           </div>

           {/* Step 2 */}
           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-green-700 rounded-full text-white flex items-center justify-center border-4 border-[#F9F8F6]">
                 <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-xs font-bold text-ink">Platform Verified</p>
              </div>
           </div>

           {/* Step 3 (Current) */}
           <div className="flex-1 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#FBEAC8] rounded-full text-[#9D7936] flex items-center justify-center border-4 border-[#F9F8F6]">
                 <Clock className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-xs font-bold text-ink">Processing Bank Transfer</p>
              </div>
           </div>

           {/* Step 4 (Future) */}
           <div className="flex-1 flex flex-col items-center text-center gap-3 opacity-50">
              <div className="w-12 h-12 bg-[#E5E1D6] rounded-full text-ink-secondary flex items-center justify-center border-4 border-[#F9F8F6]">
                 <div className="w-4 h-4 bg-ink-tertiary rounded-[4px]"></div>
              </div>
              <div>
                 <p className="text-xs font-bold text-ink">Funds Settled</p>
              </div>
           </div>

        </div>
      </div>

    </div>
  );
}

// Mini SVG Component for the sparkline trend
function TrendingLine() {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 10.5L7.5 4.5L12 8L22.5 1.5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 1.5H22.5V7.5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
