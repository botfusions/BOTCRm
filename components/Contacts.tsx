
import React, { useState, useEffect } from 'react';
import { 
    Search, MoreHorizontal, Phone, Mail, UserPlus, Trash2, X, Save, Eye, 
    Download, LayoutGrid, List, Loader2, Database, Terminal, Zap, ExternalLink 
} from 'lucide-react';
import { Contact } from '../types';
import { fetchContacts, createContact, deleteContact } from '../services/contactService';

interface ContactsProps {
    darkMode: boolean;
    language?: 'TR' | 'EN';
}

const Contacts: React.FC<ContactsProps> = ({ darkMode, language = 'TR' }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<string | null>(null);
    
    const [newContact, setNewContact] = useState({
        fullName: '',
        title: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setErrorType(null);
        try {
            const data = await fetchContacts();
            setContacts(data);
        } catch (err: any) {
            if (err.message === 'CONTACTS_TABLE_NOT_FOUND') setErrorType('CONTACTS_TABLE_NOT_FOUND');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ["Full Name", "Title", "Email", "Phone", "Status"];
        const rows = contacts.map(c => [c.fullName, c.title, c.email, c.phone, c.status]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "BOTSCRm_Contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(language === 'TR' ? 'Bu kişiyi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this contact?')) {
            const success = await deleteContact(id);
            if (success) {
                setContacts(prev => prev.filter(c => c.id !== id));
                setOpenMenuId(null);
            }
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const contact: Omit<Contact, 'id'> = {
            fullName: newContact.fullName,
            title: newContact.title,
            email: newContact.email,
            phone: newContact.phone,
            companyId: 'manual',
            avatarUrl: `https://ui-avatars.com/api/?name=${newContact.fullName}&background=6366f1&color=fff`,
            status: 'Active'
        };
        const saved = await createContact(contact);
        if (saved) {
            setContacts(prev => [saved, ...prev]);
            setIsAddModalOpen(false);
            setNewContact({ fullName: '', title: '', email: '', phone: '' });
        }
    };

    const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textMain = darkMode ? 'text-white' : 'text-slate-900';
    const textSub = darkMode ? 'text-slate-400' : 'text-slate-500';

    const filteredContacts = contacts.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (errorType === 'CONTACTS_TABLE_NOT_FOUND') {
        const sqlCode = `CREATE TABLE bots_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'Active',
  company_id TEXT
);`;
        return (
            <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'}`}>
                <div className={`max-w-2xl p-10 rounded-[3rem] border shadow-2xl ${bgCard}`}>
                    <Database className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h2 className={`text-3xl font-bold mb-4 ${textMain}`}>Kişiler Tablosu Eksik</h2>
                    <p className="text-sm text-slate-500 mb-8">Devam etmek için aşağıdaki SQL kodunu Supabase SQL Editör'e yapıştırın.</p>
                    <pre className="p-6 rounded-2xl bg-black border border-white/10 text-emerald-400 text-xs text-left overflow-x-auto font-mono mb-8">{sqlCode}</pre>
                    <button onClick={() => window.location.reload()} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"><Zap className="w-5 h-5 fill-white" /> TABLOYU OLUŞTURDUM, YENİLE</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full flex flex-col p-8 ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'}`}>
            <header className="flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>{language === 'TR' ? 'Kişiler' : 'Contacts'}</h1>
                    <p className={`mt-1 text-sm ${textSub}`}>{language === 'TR' ? 'CRM Veritabanındaki tüm iletişim kanalları.' : 'All communication channels in CRM.'}</p>
                </div>
                <div className="flex gap-3">
                    <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <button onClick={() => setViewType('grid')} className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-indigo-600 text-white shadow-md' : textSub}`}><LayoutGrid className="w-4 h-4"/></button>
                        <button onClick={() => setViewType('table')} className={`p-2 rounded-lg transition-all ${viewType === 'table' ? 'bg-indigo-600 text-white shadow-md' : textSub}`}><List className="w-4 h-4"/></button>
                    </div>
                    <button onClick={exportToCSV} className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all ${bgCard} ${textMain} hover:border-indigo-500/50 hover:shadow-lg`}>
                        <Download className="w-4 h-4" /> CSV İndir
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                        <UserPlus className="w-4 h-4" /> {language === 'TR' ? 'Yeni Kişi' : 'New Contact'}
                    </button>
                </div>
            </header>

            <div className="mb-6 relative max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSub}`} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'TR' ? "İsim veya e-posta ile ara..." : "Search..."} 
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${bgCard} ${textMain} focus:ring-2 focus:ring-indigo-500/20`}
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
                {loading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                ) : viewType === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredContacts.map(contact => (
                            <div key={contact.id} className={`group relative rounded-[2.5rem] border transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] overflow-hidden ${bgCard} hover:border-indigo-500/40`}>
                                <div className="h-28 bg-indigo-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-500 opacity-90"></div>
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                                        className="absolute top-4 right-4 p-2 bg-black/10 text-white rounded-full hover:bg-black/20 backdrop-blur-md transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    {openMenuId === contact.id && (
                                        <div className={`absolute right-4 top-14 w-32 rounded-xl border shadow-xl z-30 overflow-hidden ${bgCard} animate-in fade-in slide-in-from-top-2`}>
                                            <button onClick={() => {setSelectedContact(contact); setOpenMenuId(null);}} className={`w-full text-left px-4 py-2.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-2 ${textMain}`}><Eye className="w-3.5 h-3.5"/> Gör</button>
                                            <button onClick={() => handleDelete(contact.id)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 flex items-center gap-2 font-bold border-t border-slate-100 dark:border-slate-800"><Trash2 className="w-3.5 h-3.5"/> Sil</button>
                                        </div>
                                    )}
                                </div>
                                <div className="px-8 pb-10 -mt-12 relative z-10">
                                    <div className="flex items-end gap-5 mb-6">
                                        <img src={contact.avatarUrl} className="w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-100" alt="" />
                                        <div className="pb-1.5">
                                            <h3 className={`text-xl font-black tracking-tight leading-none ${textMain}`}>{contact.fullName}</h3>
                                            <p className="text-sm font-bold text-indigo-500 mt-1 uppercase tracking-widest">{contact.title || 'Müşteri'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">E-POSTA</p>
                                            <p className={`text-sm font-bold truncate ${textMain}`}>{contact.email}</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">TELEFON</p>
                                            <p className={`text-sm font-bold ${textMain}`}>{contact.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setSelectedContact(contact)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black tracking-[0.15em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase">Mesaj Gönder</button>
                                        <button onClick={() => handleDelete(contact.id)} className={`p-4 rounded-2xl border ${bgCard} ${textSub} hover:border-rose-500/50 hover:text-rose-500 transition-all`}><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`rounded-3xl border overflow-hidden ${bgCard}`}>
                        <table className="w-full text-left">
                            <thead className={`border-b ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <tr>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Kişi Bilgisi</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Ünvan</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">E-posta</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Telefon</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Durum</th>
                                    <th className="p-5"></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                {filteredContacts.map(c => (
                                    <tr key={c.id} className="hover:bg-indigo-500/5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <img src={c.avatarUrl} className="w-10 h-10 rounded-xl" />
                                                <span className={`text-sm font-bold ${textMain}`}>{c.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500 font-bold uppercase tracking-wide">{c.title}</td>
                                        <td className="p-5 text-sm text-slate-500 font-medium">{c.email}</td>
                                        <td className="p-5 text-sm text-slate-500 font-medium">{c.phone}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20">{c.status}</span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button onClick={() => setSelectedContact(c)} className="p-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"><ExternalLink className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* QUICK VIEW MODAL - REVISED */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-[3rem] border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${bgCard}`}>
                        <div className="relative h-36 bg-indigo-600">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-500 opacity-90"></div>
                             <button onClick={() => setSelectedContact(null)} className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 backdrop-blur-md transition-transform hover:rotate-90"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="px-12 pb-12 -mt-14 relative z-10">
                            <img src={selectedContact.avatarUrl} className="w-28 h-28 rounded-[2rem] border-4 border-white dark:border-slate-900 shadow-2xl mb-5 bg-slate-100" />
                            <h2 className={`text-3xl font-black tracking-tight ${textMain}`}>{selectedContact.fullName}</h2>
                            <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-xs mb-10">{selectedContact.title}</p>
                            
                            <div className="grid grid-cols-2 gap-5 mb-10">
                                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">E-POSTA</p>
                                    <p className={`text-sm font-bold truncate ${textMain}`}>{selectedContact.email}</p>
                                </div>
                                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">TELEFON</p>
                                    <p className={`text-sm font-bold ${textMain}`}>{selectedContact.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all uppercase">Mesaj Gönder</button>
                                <button onClick={() => handleDelete(selectedContact.id)} className="px-6 py-5 border border-rose-500/30 text-rose-500 rounded-2xl hover:bg-rose-500/10 transition-colors shadow-lg"><Trash2 className="w-6 h-6"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={`w-full max-w-md rounded-[3rem] border shadow-2xl overflow-hidden ${bgCard}`}>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-600/5">
                            <h2 className={`text-xl font-black uppercase tracking-widest ${textMain}`}>Yeni Kişi</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className={textSub}><X className="w-6 h-6"/></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-10 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tam Adı *</label>
                                <input required placeholder="Ad Soyad" value={newContact.fullName} onChange={e => setNewContact({...newContact, fullName: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Ünvan</label>
                                <input placeholder="Örn: CTO" value={newContact.title} onChange={e => setNewContact({...newContact, title: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">E-posta</label>
                                    <input required type="email" placeholder="mail@mail.com" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Telefon</label>
                                    <input required placeholder="+90" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 mt-4 transition-transform hover:scale-[1.02] active:scale-95 uppercase">Kişiyi Kaydet</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
