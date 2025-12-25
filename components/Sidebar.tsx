import React from 'react';
import { 
  LayoutGrid, 
  Inbox, 
  Users, 
  Building2, 
  CheckSquare, 
  Phone, 
  Mail, 
  BarChart3, 
  Instagram, 
  MessageCircle, 
  Send, 
  Sun, 
  Moon,
  Sparkles,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: 'TR' | 'EN';
  setLanguage: (lang: 'TR' | 'EN') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  language,
  setLanguage,
  onLogout
}) => {
  
  const mainNav = [
    { id: Tab.DASHBOARD, icon: LayoutGrid, label: language === 'TR' ? 'Gösterge Paneli' : 'Dashboard' },
    { id: Tab.INBOX, icon: Inbox, label: language === 'TR' ? 'Gelen Kutusu' : 'Inbox' },
    { id: Tab.LEADS, icon: Users, label: language === 'TR' ? 'Adaylar' : 'Leads' },
    { id: Tab.CONTACTS, icon: Users, label: language === 'TR' ? 'Kişiler' : 'Contacts' },
    { id: Tab.COMPANIES, icon: Building2, label: language === 'TR' ? 'Şirketler' : 'Companies' },
    { id: Tab.TASKS, icon: CheckSquare, label: language === 'TR' ? 'Görevler' : 'Tasks' },
  ];

  const communicationNav = [
    { id: Tab.CALLS, icon: Phone, label: language === 'TR' ? 'Aramalar' : 'Calls' },
    { id: Tab.EMAILS, icon: Mail, label: language === 'TR' ? 'E-postalar' : 'Emails' },
  ];

  const channelsNav = [
    { id: Tab.INSTAGRAM, icon: Instagram, label: 'Instagram' },
    { id: Tab.WHATSAPP, icon: MessageCircle, label: 'WhatsApp' },
    { id: Tab.TELEGRAM, icon: Send, label: 'Telegram' },
  ];

  const analyticsNav = [
    { id: Tab.ANALYTICS, icon: BarChart3, label: language === 'TR' ? 'Analitik' : 'Analytics' },
  ];

  // New System/Admin Section
  const systemNav = [
    { id: Tab.SETTINGS, icon: SettingsIcon, label: language === 'TR' ? 'Ayarlar & Admin' : 'Settings & Admin' },
  ];

  const renderNavItem = (item: { id: Tab, icon: any, label: string }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 mb-1 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
            <span className="text-sm font-medium tracking-wide">
            {item.label}
            </span>
        </div>
        {isActive && <ChevronRight className="w-3 h-3 text-indigo-200 opacity-50" />}
      </button>
    );
  };

  return (
    <div className="w-64 h-full flex flex-col bg-[#0F172A] border-r border-slate-800 text-slate-100 shrink-0">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-white">Lumina CRM</span>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-8">
        
        {/* Main Section */}
        <div>
          <p className="px-4 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{language === 'TR' ? 'Navigasyon' : 'Navigation'}</p>
          <div>
            {mainNav.map(renderNavItem)}
          </div>
        </div>

        {/* Communication Section */}
        <div>
          <p className="px-4 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{language === 'TR' ? 'İletişim' : 'Communication'}</p>
          <div>
            {communicationNav.map(renderNavItem)}
          </div>
        </div>

        {/* Channels Section */}
        <div>
          <p className="px-4 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{language === 'TR' ? 'Kanallar' : 'Channels'}</p>
          <div>
            {channelsNav.map(renderNavItem)}
          </div>
        </div>

        {/* Analytics Section */}
        <div>
           <div>
            {analyticsNav.map(renderNavItem)}
          </div>
        </div>

        {/* System Section */}
        <div>
          <p className="px-4 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{language === 'TR' ? 'Sistem' : 'System'}</p>
           <div>
            {systemNav.map(renderNavItem)}
          </div>
        </div>

      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
        
        {/* Toggles Row */}
        <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-1 rounded-lg">
            {/* Theme Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
                {darkMode ? <Sun className="w-4 h-4 mr-1.5" /> : <Moon className="w-4 h-4 mr-1.5" />}
                {darkMode ? (language === 'TR' ? 'Açık' : 'Light') : (language === 'TR' ? 'Koyu' : 'Dark')}
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
            {/* Lang Toggle */}
            <button 
                onClick={() => setLanguage(language === 'TR' ? 'EN' : 'TR')}
                className="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
                {language}
            </button>
        </div>

        {/* User Mini Profile (Logout) */}
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors group"
        >
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700">
                <LogOut className="w-4 h-4" />
            </div>
            <div className="text-left">
                <p className="text-sm font-medium">{language === 'TR' ? 'Çıkış Yap' : 'Sign Out'}</p>
            </div>
        </button>

      </div>
    </div>
  );
};

export default Sidebar;