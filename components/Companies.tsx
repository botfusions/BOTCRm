
import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { fetchCompanies, createCompany } from '../services/companyService';
import { Search, Building2, MapPin, MoreVertical, Loader2, Database, Zap, Plus, X, LayoutGrid, List, ExternalLink, DollarSign } from 'lucide-react';

interface CompaniesProps {
    darkMode: boolean;
}

const Companies: React.FC<CompaniesProps> = ({ darkMode }) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
    const [errorType, setErrorType] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setErrorType(null);
        try {
            const data = await fetchCompanies();
            setCompanies(data);
        } catch (err: any) {
            if (err.message === 'COMPANIES_TABLE_NOT_FOUND') setErrorType('COMPANIES_TABLE_NOT_FOUND');
        } finally {
            setLoading(false);
        }
    };

    const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textMain = darkMode ? 'text-white' : 'text-slate-900';
    const textSub = darkMode ? 'text-slate-400' : 'text-slate-500';

    const filteredCompanies = companies.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
         <div className={`h-full flex flex-col p-8 ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'}`}>
            <header className="flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Şirketler</h1>
                    <p className={`mt-1 text-sm ${textSub}`}>Kurumsal Portföy Yönetimi</p>
                </div>
                <div className="flex gap-3">
                    <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <button onClick={() => setViewType('grid')} className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-indigo-600 text-white' : textSub}`}><LayoutGrid className="w-4 h-4"/></button>
                        <button onClick={() => setViewType('table')} className={`p-2 rounded-lg transition-all ${viewType === 'table' ? 'bg-indigo-600 text-white' : textSub}`}><List className="w-4 h-4"/></button>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                        <Plus className="w-4 h-4" /> Yeni Şirket
                    </button>
                </div>
            </header>

            <div className="mb-6 relative max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSub}`} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Şirket ismi veya sektör..." 
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${bgCard} ${textMain} focus:ring-2 focus:ring-indigo-500/20`}
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Şirketler Listeleniyor...</p>
                    </div>
                ) : viewType === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCompanies.map(company => (
                            <div key={company.id} className={`p-6 rounded-3xl border transition-all hover:border-indigo-500/30 group ${bgCard} hover:shadow-xl hover:scale-[1.01]`}>
                                <div className="flex items-center gap-5 mb-6">
                                    <img src={company.logoUrl} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                                    <div>
                                        <h3 className={`text-lg font-black tracking-tight ${textMain}`}>{company.name}</h3>
                                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">{company.industry}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        <span className="text-xs font-bold uppercase tracking-wide">{company.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-emerald-500">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-xs font-black tracking-widest uppercase">HASILAT: {company.revenue}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase border shadow-sm
                                        ${company.status === 'Client' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                          company.status === 'Partner' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                                          'bg-amber-500/10 text-amber-500 border-amber-500/20'}
                                     `}>
                                         {company.status}
                                     </span>
                                     <button className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${textSub}`}><MoreVertical className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`rounded-3xl border overflow-hidden ${bgCard}`}>
                        <table className="w-full text-left">
                            <thead className={`border-b ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <tr>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Şirket</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Sektör</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Lokasyon</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Hasilat</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Durum</th>
                                    <th className="p-5"></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                {filteredCompanies.map(c => (
                                    <tr key={c.id} className="hover:bg-indigo-500/5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <img src={c.logoUrl} className="w-8 h-8 rounded-lg" />
                                                <span className={`text-sm font-bold ${textMain}`}>{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-xs text-slate-500 font-bold uppercase">{c.industry}</td>
                                        <td className="p-5 text-xs text-slate-500 font-medium">{c.location}</td>
                                        <td className="p-5 text-xs font-bold text-emerald-500">{c.revenue}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">{c.status}</span>
                                        </td>
                                        <td className="p-5 text-right"><ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" /></td>
                                    </tr>
                                ))}
                                {filteredCompanies.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center opacity-30 flex flex-col items-center">
                                            <Building2 className="w-12 h-12 mb-4" />
                                            <p className="font-bold uppercase tracking-widest text-xs">Şirket bulunamadı</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-md rounded-[3rem] border shadow-2xl overflow-hidden ${bgCard}`}>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-600/5">
                            <h2 className={`text-xl font-black uppercase tracking-widest ${textMain}`}>Yeni Şirket</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className={textSub}><X className="w-6 h-6"/></button>
                        </div>
                        <div className="p-10 text-center text-slate-500 text-sm italic">
                            Kurumsal kayıt arayüzü yakında aktif edilecek.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Companies;
