
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Source } from '../types';
import { fetchLeads, updateLeadStatus } from '../services/leadService';
import { PIPELINE_COLUMNS } from '../constants';
import { MoreHorizontal, Instagram, MessageSquare, Mail, Megaphone, Calendar, DollarSign, Loader2, Sparkles } from 'lucide-react';

interface PipelineProps {
  darkMode: boolean;
}

const Pipeline: React.FC<PipelineProps> = ({ darkMode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      console.error("Pipeline load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stage: LeadStatus) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const leadToMove = leads.find(l => l.id === draggedLeadId);
    if (leadToMove && leadToMove.status !== stage) {
      // Optimistic Update
      setLeads(prev => prev.map(l => l.id === draggedLeadId ? { ...l, status: stage } : l));
      
      const success = await updateLeadStatus(draggedLeadId, stage);
      if (!success) {
        // Rollback on failure
        loadLeads();
      }
    }
    setDraggedLeadId(null);
  };

  const getSourceIcon = (source: Source) => {
    switch (source) {
      case Source.INSTAGRAM: return <Instagram className="w-3 h-3" />;
      case Source.WHATSAPP: return <MessageSquare className="w-3 h-3" />;
      case Source.ADS: return <Megaphone className="w-3 h-3" />;
      default: return <Mail className="w-3 h-3" />;
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium tracking-wide">Bulut Verileri Senkronize Ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pipeline</h1>
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
          <p className={`font-light ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Satış süreçlerinizin anlık görünümü.</p>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {PIPELINE_COLUMNS.map((column) => {
             const columnLeads = leads.filter(l => l.status === column);
             const columnValue = columnLeads.reduce((acc, curr) => acc + curr.value, 0);
             
             return (
              <div 
                key={column} 
                className="w-80 flex flex-col h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column as LeadStatus)}
              >
                <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{column}</span>
                    <span className="bg-white/40 px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-bold border border-white/30">{columnLeads.length}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">${columnValue.toLocaleString()}</span>
                </div>

                <div className={`flex-1 rounded-2xl p-2 space-y-3 overflow-y-auto custom-scrollbar border border-dashed transition-colors ${darkMode ? 'bg-slate-900/20 border-slate-800 hover:bg-slate-900/40' : 'bg-slate-50/30 border-slate-200 hover:bg-slate-50/50'}`}>
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className={`group p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-out relative backdrop-blur-sm ${darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-white/70 border-white/60'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2 flex-wrap">
                          {lead.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-500/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="text-slate-300 hover:text-slate-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{lead.fullName}</h4>
                      <div className="flex items-center gap-2 text-slate-500 mb-3">
                         <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full">{getSourceIcon(lead.source)}</span>
                         <span className="text-xs">{lead.source}</span>
                      </div>

                      <div className={`flex items-center justify-between pt-3 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-1.5 text-slate-600">
                           <DollarSign className="w-3 h-3 text-emerald-500" />
                           <span className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>${lead.value.toLocaleString()}</span>
                        </div>
                         {lead.lastActivity && (
                            <div className="flex items-center gap-1.5 text-slate-400" title="Last Activity">
                                <Calendar className="w-3 h-3" />
                                <span className="text-[10px]">Active</span>
                            </div>
                         )}
                      </div>
                    </div>
                  ))}
                  
                  {columnLeads.length === 0 && (
                     <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200/50 rounded-xl">
                        <span className="text-xs text-slate-400">Boş</span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
