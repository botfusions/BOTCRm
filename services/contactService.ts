
import { supabase } from './client';
import { Contact } from '../types';

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('bots_contacts')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      if (error.code === 'PGRST205') throw new Error('CONTACTS_TABLE_NOT_FOUND');
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      fullName: c.full_name,
      title: c.title,
      email: c.email,
      phone: c.phone,
      companyId: c.company_id,
      avatarUrl: c.avatar_url || `https://ui-avatars.com/api/?name=${c.full_name}&background=6366f1&color=fff`,
      status: c.status || 'Active'
    }));
  } catch (error: any) {
    if (error.message === 'CONTACTS_TABLE_NOT_FOUND') throw error;
    return [];
  }
};

export const createContact = async (contact: Omit<Contact, 'id'>): Promise<Contact | null> => {
  try {
    // Mükerrer Kontrolü (Email)
    const { data: existing } = await supabase
      .from('bots_contacts')
      .select('id')
      .eq('email', contact.email)
      .maybeSingle();

    if (existing) {
      throw new Error('DUPLICATE_RECORD');
    }

    const { data, error } = await supabase
      .from('bots_contacts')
      .insert([{
        full_name: contact.fullName,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        company_id: contact.companyId,
        avatar_url: contact.avatarUrl,
        status: contact.status
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      fullName: data.full_name,
      title: data.title,
      email: data.email,
      phone: data.phone,
      companyId: data.company_id,
      avatarUrl: data.avatar_url,
      status: data.status
    };
  } catch (error: any) {
    if (error.message === 'DUPLICATE_RECORD') throw error;
    return null;
  }
};

export const deleteContact = async (id: string): Promise<boolean> => {
    try {
        const { error } = await supabase.from('bots_contacts').delete().eq('id', id);
        return !error;
    } catch (error) {
        return false;
    }
};
