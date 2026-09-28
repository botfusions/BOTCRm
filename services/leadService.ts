
import { supabase, isDemoMode, demoId } from './client';
import { Lead, LeadStatus, Source } from '../types';
import { MOCK_LEADS } from '../constants';

export const fetchLeads = async (): Promise<Lead[]> => {
  // Demo modunda veritabanına gidilmez; örnek veri döner
  if (isDemoMode()) return MOCK_LEADS.map((l) => ({ ...l }));
  try {
    const { data, error } = await supabase
      .from('bots_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') throw new Error('TABLE_NOT_FOUND');
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      fullName: item.full_name,
      email: item.email,
      phone: item.phone,
      source: item.source as Source,
      status: item.status as LeadStatus,
      value: item.value || 0,
      tags: item.tags || [],
      lastActivity: item.last_activity || item.created_at,
      avatarUrl: item.avatar_url || `https://ui-avatars.com/api/?name=${item.full_name}&background=6366f1&color=fff`
    }));
  } catch (error: any) {
    if (error.message === 'TABLE_NOT_FOUND') throw error;
    return [];
  }
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead | null> => {
  // Demo modunda yalnızca yerel sahte kayıt döner
  if (isDemoMode()) {
    return { ...lead, id: demoId(), lastActivity: lead.lastActivity || new Date().toISOString() };
  }
  try {
    // 1. Mükerrer Kontrolü (Email)
    const { data: existing } = await supabase
      .from('bots_leads')
      .select('id')
      .eq('email', lead.email)
      .maybeSingle();

    if (existing) {
      throw new Error('DUPLICATE_RECORD');
    }

    // 2. Kayıt Ekleme
    const { data, error } = await supabase
      .from('bots_leads')
      .insert([{
        full_name: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status || LeadStatus.NEW,
        value: lead.value || 0,
        tags: lead.tags || [],
        avatar_url: lead.avatarUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      source: data.source as Source,
      status: data.status as LeadStatus,
      value: data.value,
      tags: data.tags,
      lastActivity: data.last_activity,
      avatarUrl: data.avatar_url
    };
  } catch (error: any) {
    if (error.message === 'DUPLICATE_RECORD') throw error;
    return null;
  }
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<boolean> => {
  if (isDemoMode()) return true;
  try {
    const { error } = await supabase
      .from('bots_leads')
      .update({ status, last_activity: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch (error) {
    return false;
  }
};
