
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Source } from '../types';
import { fetchLeads, createLead } from '../services/leadService';
import { 
  Search, Plus, Loader2, 
  Trash2, X, Save, Wand2, Database, Zap, AlertTriangle, Terminal, Wifi, Globe, Mail, Phone, DollarSign
} from 'lucide-react';
import OpportunityDetails from './OpportunityDetails';
import { GoogleGenAI, Type } from "@google/genai";

interface LeadsProps {
  darkMode: boolean;
  language?: 'TR' | 'EN';
}

const Leads: React.FC<LeadsProps> = ({ darkMode, language = 'TR' }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);
  
  const [newLead, setNewLead] = useState({
    fullName: '',
    email: '',
    phone: '',
    value: 0,
    source: Source.MANUAL
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err: any) {
      if (err.message === 'TABLE_NOT_FOUND') {
        setErrorType('TABLE_NOT_FOUND');
      }
    } finally {
      setLoading(false);
    }
  };

  const parseWithAI = async () => {
    if (!rawText.trim()) return;
    setParsing(true);
    setDuplicateError(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiz et ve sadece JSON dön. Metin: "${rawText}". Çıktı şu anahtarları içermeli: fullName, email, phone, source (Instagram, WhatsApp, Manual, Ads). Eğer veri yoksa boş bırak.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["fullName"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setNewLead({
        fullName: result.fullName || '',
        email: result.email || '',
        phone: result.phone || '',
        value: 0,
        source: (Object.values(Source).includes(result.source as any) ? result.source : Source.MANUAL) as Source
      });
      setRawText('');
    } catch (error) {
      console.error("AI Parsing Error:", error);
    } finally {
      setParsing(false);
    }
  };

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(false);

    if (!newLead.fullName || !newLead.email || !newLead.phone) {
        alert(language === 'TR' ? 'Lütfen en az Ad, E-posta ve Telefon bilgilerini doldurun.' : 'Please fill in Name, Email and Phone fields.');
        return;
    }

    try {
        const savedLead = await createLead({
          ...newLead,
          status: LeadStatus.NEW,
          tags: ['BOTSCRm-MANUAL'],
          lastActivity: new Date().toISOString(),
          avatarUrl: `https://ui-avatars.com/api/?name=${newLead.fullName}&background=6366f1&color=fff`
        });

        if (savedLead) {
          setLeads(prev => [savedLead, ...prev]);
          setNewLead({ fullName: '', email: '', phone: '', value: 0, source: Source.MANUAL });
          setIsModalOpen(false);
        }
    } catch (error: any) {
        if (error.message === 'DUPLICATE_RECORD') {
            setDuplicateError(true);
            setTimeout(() => setDuplicateError(false), 5000);
        }
    }
  };

  const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = darkMode ? 'text-white' : 'text-slate-900';
  const textSub = darkMode ? 'text-slate-400' : 'text-slate-500';

  if (selectedLead) {
    return <OpportunityDetails darkMode={darkMode} language={language} onBack={() => setSelectedLead(null)} />;
  }

  return (
    <div className={`h-full flex flex-col p-8 ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'} relative overflow-hidden`}>
        <header className="flex justify-between items-end mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Database className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Aday Veritabanı</h1>
                <p className={`text-sm ${textSub}`}>Canlı Supabase Bağlantısı Aktif</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={loadData} className={`p-2.5 rounded-xl border ${bgCard} ${textSub} hover:text-indigo-500 hover:border-indigo-500/50 transition-all`}>
                <Wifi className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Yeni Aday
            </button>
          </div>
        </header>

        {duplicateError && (
            <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <p className="text-sm font-bold text-amber-500">Bu e-posta adresiyle kayıtlı bir aday zaten sistemde mevcut.</p>
                </div>
            </div>
        )}

        <div className={`flex-1 overflow-hidden border rounded-3xl shadow-sm ${bgCard} mb-6`}>
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Veriler Çekiliyor...</p>
             </div>
          ) : (
            <div className="overflow-y-auto h-full custom-scrollbar">
              <table className="w-full text-left">
                <thead className={`sticky top-0 z-10 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border-b`}>
                  <tr>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Aday İsmi</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">İletişim</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Durum</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Değer</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Kaynak</th>
                    <th className="p-5"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {leads.map((lead) => (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-indigo-500/5 transition-colors cursor-pointer group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <img src={lead.avatarUrl} className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
                            <span className={`text-sm font-bold ${textMain}`}>{lead.fullName}</span>
                          </div>
                        </td>
                        <td className="p-5">
                            <p className="text-xs font-medium text-slate-500">{lead.email}</p>
                            <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{lead.phone}</p>
                        </td>
                        <td className="p-5">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase">{lead.status}</span>
                        </td>
                        <td className="p-5 text-sm font-bold text-emerald-500">${lead.value.toLocaleString()}</td>
                        <td className="p-5 text-xs text-slate-500 font-bold uppercase tracking-widest">{lead.source}</td>
                        <td className="p-5 text-right"><Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" /></td>
                      </tr>
                  ))}
                  {!loading && leads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-20 text-center">
                            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Henüz aday kaydı yok.</p>
                        </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI CAPTURE PANEL */}
        <div className={`shrink-0 p-6 rounded-3xl border-t-4 border-t-indigo-600 shadow-2xl ${bgCard} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-1 opacity-5"><Zap className="w-32 h-32 text-indigo-500" /></div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Wand2 className="w-4 h-4 text-indigo-500" />
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500`}>AI Metin Analiz Motoru</label>
                    </div>
                    <div className="relative">
                        <textarea 
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            className={`w-full h-24 p-4 rounded-2xl border text-sm outline-none transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
                            placeholder="Müşteri mesajını buraya yapıştırın, AI bilgileri ayıklasın..."
                        />
                        <button onClick={parseWithAI} disabled={parsing || !rawText.trim()} className="absolute bottom-3 right-3 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase tracking-widest">
                            {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analiz Et"}
                        </button>
                    </div>
                </div>
                <div className="flex-[1.5]">
                    <form onSubmit={handleQuickSave} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end h-full">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tam Adı</label>
                            <input required value={newLead.fullName} onChange={e => setNewLead({...newLead, fullName: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">E-Posta</label>
                            <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telefon</label>
                            <input required value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all uppercase">
                            Supabase Kaydet
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className={`w-full max-w-lg rounded-[3rem] border shadow-2xl p-10 ${bgCard}`}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className={`text-xl font-black uppercase tracking-widest ${textMain}`}>Yeni Kayıt</h2>
                        <button onClick={() => setIsModalOpen(false)} className={textSub}><X className="w-7 h-7" /></button>
                    </div>
                    {duplicateError && (
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-500">
                            Bu e-posta zaten kullanımda!
                        </div>
                    )}
                    <form onSubmit={handleQuickSave} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Müşteri İsmi</label>
                            <input required placeholder="Ad Soyad" value={newLead.fullName} onChange={e => setNewLead({...newLead, fullName: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-Posta</label>
                                <input required type="email" placeholder="mail@domain.com" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Telefon</label>
                                <input required placeholder="+90" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all uppercase">
                            Veritabanına İşle
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Leads;
