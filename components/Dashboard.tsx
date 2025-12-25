
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { REVENUE_DATA } from '../constants';
import { Activity, ArrowUpRight, Instagram, Mail, MessageSquare, ShieldCheck, Wifi, Users as UsersIconBase, DollarSign, TrendingUp, Wallet, Loader2 } from 'lucide-react';
import { fetchLeads } from '../services/leadService';
import { Lead } from '../types';

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = leads.reduce((acc, l) => acc + (l.status === 'Won' ? l.value : 0), 0);
  const pipelineValue = leads.reduce((acc, l) => acc + l.value, 0);
  const activeDeals = leads.length;
  const winRate = leads.length > 0 ? ((leads.filter(l => l.status === 'Won').length / leads.length) * 100).toFixed(1) : 0;

  const bgMain = darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]';
  const cardClass = `relative overflow-hidden rounded-3xl border transition-all duration-300 ${
    darkMode 
      ? 'bg-zinc-900/40 border-white/5 backdrop-blur-md hover:border-white/10 hover:bg-zinc-900/60' 
      : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
  }`;
  const textMain = darkMode ? 'text-white' : 'text-slate-900';
  const textSub = darkMode ? 'text-zinc-400' : 'text-slate-500';

  return (
    <div className={`p-8 space-y-8 h-full overflow-y-auto custom-scrollbar ${bgMain}`}>
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${textMain}`}>Overview</h1>
          <p className={`text-sm ${textSub}`}>Supabase ile canlı verileriniz senkronize edildi.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${darkMode ? 'bg-black/20 border-white/10 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <span className="text-xs font-medium">Live Connection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Won Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+8.2%" 
          trendUp={true}
          icon={Wallet}
          color="amber"
          darkMode={darkMode}
        />
        <MetricCard 
          title="Pipeline Value" 
          value={`$${pipelineValue.toLocaleString()}`} 
          trend="+22.5%" 
          trendUp={true}
          icon={Activity}
          color="rose"
          darkMode={darkMode}
        />
        <MetricCard 
          title="Active Leads" 
          value={activeDeals.toString()} 
          trend="+12%" 
          trendUp={true}
          icon={UsersIconBase}
          color="indigo"
          darkMode={darkMode}
        />
        <MetricCard 
          title="Win Rate" 
          value={`${winRate}%`} 
          trend="+4.2%" 
          trendUp={true}
          icon={TrendingUp}
          color="emerald"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${cardClass} p-8 min-h-[400px]`}>
           <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className={`text-lg font-semibold ${textMain}`}>Revenue Analytics</h3>
                <p className={`text-xs mt-1 ${textSub}`}>Trend analizi ve tahminleme</p>
            </div>
          </div>
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#52525b' : '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: darkMode ? '#52525b' : '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip cursor={{ stroke: darkMode ? '#ffffff20' : '#00000020', strokeWidth: 2 }} contentStyle={{ backgroundColor: darkMode ? '#09090b' : '#fff', border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', color: darkMode ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} p-8 flex flex-col justify-between`}>
            <div>
                <h3 className={`text-lg font-semibold ${textMain}`}>Revenue Target</h3>
                <div className="flex gap-4 mt-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className={`text-xs ${textSub}`}>Won</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-200"></div>
                        <span className={`text-xs ${textSub}`}>Pipeline</span>
                     </div>
                </div>
            </div>
            <div className="relative w-full aspect-square max-h-[220px] mx-auto mt-6 flex items-center justify-center">
                 <div className="absolute w-full h-full rounded-full border-[12px] border-zinc-800/50"></div>
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" strokeDasharray="280" strokeDashoffset={280 - (280 * (totalRevenue / (pipelineValue || 1)))} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000" />
                 </svg>
                 <div className="absolute text-center">
                    <p className={`text-2xl font-bold ${textMain}`}>${(totalRevenue / 1000).toFixed(1)}k</p>
                    <p className={`text-xs ${textSub}`}>Target: $100k</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
    title: string, value: string, trend: string, trendUp: boolean, icon: any, color: 'amber' | 'indigo' | 'rose' | 'emerald', darkMode: boolean
}> = ({ title, value, trend, trendUp, icon: Icon, color, darkMode }) => {
    const colors = {
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    };
    const c = colors[color];
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 group ${darkMode ? 'bg-zinc-900/40 border-white/5 backdrop-blur-md hover:bg-zinc-900/60' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border ${c.bg} ${c.text} ${darkMode ? 'border-white/5' : c.border}`}><Icon className="w-5 h-5" /></div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${trendUp ? (darkMode ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') : (darkMode ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')}`}>
                    {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {trend}
                </div>
            </div>
            <h3 className={`text-3xl font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
            <p className={`text-sm font-medium ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{title}</p>
        </div>
    );
}

export default Dashboard;
