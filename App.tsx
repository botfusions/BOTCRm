
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import Leads from './components/Leads';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Contacts from './components/Contacts';
import Companies from './components/Companies';
import LandingPage from './components/landing/Page';
import { Tab } from './types';
import { Construction, Bell, Search, HelpCircle, Plus, Loader2 } from 'lucide-react';
import { supabase } from './services/client';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');
  const [initializing, setInitializing] = useState(true);
  
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // 1. Mevcut oturumu kontrol et
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          updateProfileFromSession(session.user);
          setShowLanding(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setInitializing(false);
      }
    };

    // 2. Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        updateProfileFromSession(session.user);
        setShowLanding(false);
      } else if (event === 'SIGNED_OUT') {
        setShowLanding(true);
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, []);

  const updateProfileFromSession = (user: any) => {
    if (!user) return;
    setUserProfile({
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      email: user.email || '',
      phone: user.user_metadata?.phone_number || ''
    });
  };

  useEffect(() => {
    if (darkMode || showLanding) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, showLanding]);

  const handleLogin = () => setShowLanding(false);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLanding(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD: return <Dashboard darkMode={darkMode} />;
      case Tab.PIPELINE: return <Pipeline darkMode={darkMode} />;
      case Tab.LEADS: return <Leads darkMode={darkMode} language={language} />;
      case Tab.CONTACTS: return <Contacts darkMode={darkMode} language={language} />;
      case Tab.COMPANIES: return <Companies darkMode={darkMode} />;
      case Tab.TASKS: return <Tasks darkMode={darkMode} />;
      case Tab.SETTINGS: return <Settings darkMode={darkMode} language={language} onLogout={handleLogout} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <div className={`p-8 rounded-3xl border flex flex-col items-center text-center max-w-md ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <Construction className="w-12 h-12 mb-4" />
                <h2 className="text-xl font-medium mb-2">{activeTab} Modülü</h2>
                <p className="text-sm">Geliştirme aşamasındadır.</p>
             </div>
          </div>
        );
    }
  };

  if (initializing) {
    return (
      <div className="h-screen w-full bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (showLanding) return <LandingPage onLogin={handleLogin} language={language} setLanguage={setLanguage} />;

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F3F4F6] text-slate-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 w-1/3">
                <Search className="w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Ara..." className="bg-transparent text-sm focus:outline-none w-full" />
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Bell className="w-5 h-5" /></button>
                <button 
                  onClick={() => setActiveTab(Tab.LEADS)}
                  className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                   <Plus className="w-5 h-5" />
                </button>
                 <div className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden md:block">
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userProfile.fullName}</p>
                        <p className="text-[10px] text-slate-500">{userProfile.email}</p>
                    </div>
                    <img src={`https://ui-avatars.com/api/?name=${userProfile.fullName || 'User'}&background=6366f1&color=fff`} className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-sm" alt="User" />
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
