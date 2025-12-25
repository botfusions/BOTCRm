
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, Plus, Filter, Link as LinkIcon, X, Save, Loader2, Database, Terminal, Zap } from 'lucide-react';
import { Task } from '../types';
import { fetchTasks, createTask, toggleTaskStatus } from '../services/taskService';

interface TasksProps {
  darkMode: boolean;
}

const Tasks: React.FC<TasksProps> = ({ darkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err: any) {
      if (err.message === 'TASKS_TABLE_NOT_FOUND') {
        setErrorType('TASKS_TABLE_NOT_FOUND');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    // Optimistic
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    const success = await toggleTaskStatus(id, !currentStatus);
    if (!success) loadTasks();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Omit<Task, 'id'> = {
        title: newTaskTitle,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: 'Admin'
    };

    const savedTask = await createTask(newTask);
    if (savedTask) {
      setTasks([savedTask, ...tasks]);
      setNewTaskTitle('');
      setIsModalOpen(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = darkMode ? 'text-white' : 'text-slate-900';

  if (errorType === 'TASKS_TABLE_NOT_FOUND') {
    // Fixed SQL snippet to use correct table names used by taskService
    const sqlCode = `CREATE TABLE bots_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  assigned_to TEXT,
  lead_id UUID REFERENCES bots_leads(id) ON DELETE SET NULL
);`;

    return (
        <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${darkMode ? 'bg-slate-950' : 'bg-[#F3F4F6]'}`}>
            <div className={`max-w-2xl p-10 rounded-[3rem] border shadow-2xl ${bgCard}`}>
                <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-8">
                    <Database className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className={`text-3xl font-bold mb-4 ${textMain}`}>Görev Tablosu Eksik</h2>
                <p className="text-sm mb-8 text-slate-500">
                    Görev yönetimi için <b>'bots_tasks'</b> tablosu gereklidir. Lütfen bu SQL kodunu çalıştırın:
                </p>
                <div className="relative group mb-8">
                    <pre className="p-6 rounded-2xl bg-black border border-white/10 text-emerald-400 text-xs text-left overflow-x-auto font-mono leading-relaxed">
                        {sqlCode}
                    </pre>
                    <button 
                        onClick={() => {navigator.clipboard.writeText(sqlCode); alert('SQL kopyalandı!')}}
                        className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[10px]"
                    >
                        <Terminal className="w-3 h-3" /> KOPYALA
                    </button>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Zap className="w-5 h-5 fill-white" /> TABLOYU OLUŞTURDUM, YENİLE
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
       <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Tasks</h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bulut üzerinde senkronize görevler.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
            <Plus className="w-4 h-4" /> New Task
        </button>
      </header>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    filter === f 
                    ? 'bg-slate-800 text-white border-slate-800 dark:bg-indigo-600 dark:border-indigo-600' 
                    : 'bg-white/40 text-slate-600 border-white/40 dark:text-slate-400'
                }`}
            >
                {f.toUpperCase()}
            </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-8">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        ) : filteredTasks.map((task) => (
            <div key={task.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${bgCard} ${task.completed ? 'opacity-50' : 'hover:border-indigo-500/30'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task.id, task.completed)} className={task.completed ? 'text-emerald-500' : 'text-slate-300'}>
                        {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'} ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" /> {task.dueDate}
                </div>
            </div>
        ))}
        {!loading && filteredTasks.length === 0 && (
            <div className="py-20 text-center opacity-30">
                <p>Henüz görev yok.</p>
            </div>
        )}
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${bgCard} animate-in zoom-in-95 duration-200`}>
                  <div className="flex justify-between items-center mb-6">
                      <h2 className={`text-xl font-bold ${textMain}`}>Yeni Görev</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <form onSubmit={handleAddTask} className="space-y-4">
                      <input required autoFocus placeholder="Görev başlığı..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/20 ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 focus:border-indigo-500'}`} />
                      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">BULUTA EKLE</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Tasks;
