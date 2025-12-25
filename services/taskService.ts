
import { supabase } from './client';
import { Task } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('bots_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') throw new Error('TASKS_TABLE_NOT_FOUND');
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      dueDate: t.due_date,
      assignedTo: t.assigned_to,
      leadId: t.lead_id
    }));
  } catch (error: any) {
    if (error.message === 'TASKS_TABLE_NOT_FOUND') throw error;
    return [];
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('bots_tasks')
      .insert([{
        title: task.title,
        completed: task.completed,
        due_date: task.dueDate,
        assigned_to: task.assignedTo,
        lead_id: task.leadId
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      leadId: data.lead_id
    };
  } catch (error) {
    return null;
  }
};

export const toggleTaskStatus = async (id: string, completed: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bots_tasks')
      .update({ completed })
      .eq('id', id);

    return !error;
  } catch (error) {
    return false;
  }
};
