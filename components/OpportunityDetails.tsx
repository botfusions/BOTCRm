import React from 'react';
import { 
  Check, 
  ChevronRight, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Search, 
  Calendar, 
  ArrowLeft,
  Plus,
  Building2,
  FileText
} from 'lucide-react';

interface OpportunityDetailsProps {
  darkMode: boolean;
  language: 'TR' | 'EN';
  onBack: () => void;
}

const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({ darkMode, language, onBack }) => {
  const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = darkMode ? 'text-white' : 'text-slate-900';
  const textSub = darkMode ? 'text-slate-400' : 'text-slate-500';
  const border = darkMode ? 'border-slate-800' : 'border-slate-200';

  const stages = [
    { name: 'Prospecting', status: 'completed' },
    { name: 'Qualified', status: 'completed' },
    { name: 'Discovery', status: 'completed' },
    { name: 'Proposal Sent', status: 'current' },
    { name: 'Negotiation', status: 'upcoming' },
    { name: 'Closed', status: 'upcoming' },
  ];

  return (
    <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'}`}>
      
      {/* Header */}
      <div className={`px-8 py-5 border-b shrink-0 flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div className="flex items-center gap-4">
            <button onClick={onBack} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className={`text-xl font-semibold ${textMain}`}>SaaS Collaboration Tool Deal</h1>
                <div className="flex gap-4 mt-1 text-sm">
                    <span className={`font-medium border-b-2 border-emerald-500 pb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Overview</span>
                    <span className={`font-medium pb-0.5 text-slate-400 cursor-pointer hover:${textMain}`}>Tasks</span>
                    <span className={`font-medium pb-0.5 text-slate-400 cursor-pointer hover:${textMain}`}>Notes</span>
                </div>
            </div>
         </div>
         <div className="flex gap-3">
             <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                 <Search className="w-5 h-5" />
             </button>
              <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                 <MoreHorizontal className="w-5 h-5" />
             </button>
             <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm">
                 <Plus className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
            
            {/* Left Column (Main Info) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Stages Card */}
                <div className={`rounded-xl border p-6 shadow-sm ${bgCard}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-semibold ${textMain}`}>Stages</h3>
                        <button className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                            Move to Next Stage
                        </button>
                    </div>
                    
                    {/* Progress Bar Visual */}
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className={`absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 -z-0 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        
                        {stages.map((stage, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-inherit px-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                                    ${stage.status === 'completed' ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900' : 
                                      stage.status === 'current' ? 'bg-white border-dashed border-slate-900 text-slate-900 dark:bg-slate-900 dark:border-white dark:text-white' : 
                                      'bg-white border-slate-200 text-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-600'
                                    }`}
                                >
                                    {stage.status === 'completed' && <Check className="w-3 h-3" />}
                                    {stage.status !== 'completed' && (index + 1)}
                                </div>
                                <span className={`text-xs font-medium ${stage.status === 'current' ? textMain : textSub}`}>
                                    {stage.name}
                                </span>
                                {stage.status === 'current' && (
                                    <div className={`h-0.5 w-full absolute top-1/2 left-0 -translate-y-1/2 -z-10 bg-slate-900 dark:bg-white`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details & Financials Grid */}
                <div className={`rounded-xl border p-6 shadow-sm ${bgCard}`}>
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Opportunity ID</label>
                            <p className={`font-medium ${textMain}`}>OP-001</p>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Industry</label>
                            <p className={`font-medium ${textMain}`}>Technology/Software</p>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Close Date</label>
                            <p className={`font-medium ${textMain}`}>2024-12-05</p>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Probability</label>
                            <p className={`font-medium ${textMain}`}>70%</p>
                        </div>
                    </div>

                    <div className={`h-[1px] w-full mb-8 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                    <h3 className={`font-semibold mb-6 ${textMain}`}>Financials</h3>
                    {/* Row 2 */}
                    <div className="grid grid-cols-4 gap-6">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Expected Revenue</label>
                            <p className={`font-medium ${textMain}`}>$8,000</p>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Discount Offered</label>
                            <p className={`font-medium ${textMain}`}>10%</p>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Subscription Details</label>
                            <p className={`font-medium ${textMain}`}>$80/user/year</p>
                        </div>
                         <div>
                            <label className={`text-xs font-medium uppercase tracking-wide mb-1 block ${textSub}`}>Competitor Pricing</label>
                            <p className={`font-medium ${textMain}`}>$85/user/year</p>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className={`rounded-xl border p-6 shadow-sm ${bgCard}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-semibold ${textMain}`}>Activity</h3>
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${darkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                            <Calendar className={`w-3.5 h-3.5 ${textSub}`} />
                            <span className={`text-xs font-medium ${textMain}`}>March 25 - July 25</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Feed Item 1 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className={`w-0.5 h-full mt-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                            </div>
                            <div className="pb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src="https://picsum.photos/100/100?random=10" className="w-5 h-5 rounded-full" />
                                    <span className={`text-sm font-medium ${textMain}`}>John scheduled a call</span>
                                    <span className={`text-xs ${textSub}`}>Apr 18, 2023 at 4:05PM</span>
                                </div>
                            </div>
                        </div>

                         {/* Feed Item 2 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                                    <FileText className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-sm font-medium ${textMain}`}>Opportunity created, discovery call completed.</span>
                                    <span className={`text-xs ${textSub}`}>Apr 18, 2023 at 4:05PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Contacts Section */}
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-semibold ${textMain}`}>Contacts</h3>
                        <button className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${textSub}`}>
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Contact Card 1 */}
                    <div className={`rounded-xl border p-4 shadow-sm mb-3 ${bgCard}`}>
                         <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                            Primary Contact
                         </div>
                         <div className="flex items-center gap-3 mb-4">
                            <img src="https://picsum.photos/100/100?random=20" className="w-10 h-10 rounded-full" />
                            <div>
                                <p className={`text-sm font-bold ${textMain}`}>Jane Doe</p>
                                <p className={`text-xs ${textSub}`}>Product Manager</p>
                            </div>
                            <button className="ml-auto text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span>leslie@market.com</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone className="w-3.5 h-3.5" />
                                <span>(208) 555-0112</span>
                             </div>
                         </div>
                    </div>

                    {/* Contact Card 2 */}
                    <div className={`rounded-xl border p-4 shadow-sm mb-3 ${bgCard}`}>
                         <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                            Key Influencer
                         </div>
                         <div className="flex items-center gap-3 mb-4">
                            <img src="https://picsum.photos/100/100?random=21" className="w-10 h-10 rounded-full" />
                            <div>
                                <p className={`text-sm font-bold ${textMain}`}>John Smith</p>
                                <p className={`text-xs ${textSub}`}>IT Director</p>
                            </div>
                            <button className="ml-auto text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span>john@market.com</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone className="w-3.5 h-3.5" />
                                <span>(208) 555-0112</span>
                             </div>
                         </div>
                    </div>

                    {/* Contact Card 3 */}
                    <div className={`rounded-xl border p-4 shadow-sm ${bgCard}`}>
                         <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                            Final Approver
                         </div>
                         <div className="flex items-center gap-3 mb-4">
                            <img src="https://picsum.photos/100/100?random=22" className="w-10 h-10 rounded-full" />
                            <div>
                                <p className={`text-sm font-bold ${textMain}`}>Mike Ross</p>
                                <p className={`text-xs ${textSub}`}>CTO</p>
                            </div>
                            <button className="ml-auto text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span>mike@market.com</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone className="w-3.5 h-3.5" />
                                <span>(208) 555-0112</span>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Company Section */}
                <div>
                     <h3 className={`font-semibold mb-4 ${textMain}`}>Company</h3>
                     <div className={`rounded-xl border p-4 shadow-sm ${bgCard}`}>
                         <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                 </div>
                                 <div>
                                    <p className={`text-sm font-bold ${textMain}`}>Code Sphere</p>
                                    <p className={`text-xs ${textSub}`}>Technology</p>
                                 </div>
                             </div>
                              <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 mt-4">
                             <div>
                                 <p className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Industry</p>
                                 <p className={`text-xs font-medium ${textMain} mt-1`}>Technology</p>
                             </div>
                             <div>
                                 <p className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Location</p>
                                 <p className={`text-xs font-medium ${textMain} mt-1`}>Indonesia</p>
                             </div>
                             <div>
                                 <p className={`text-[10px] font-bold uppercase tracking-wider ${textSub}`}>Employees</p>
                                 <div className="mt-1 inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">100K+</div>
                             </div>
                         </div>
                     </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
