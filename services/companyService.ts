
import { supabase } from './client';
import { Company } from '../types';

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('bots_companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      if (error.code === 'PGRST205') throw new Error('COMPANIES_TABLE_NOT_FOUND');
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      location: c.location,
      employees: c.employees,
      revenue: c.revenue,
      logoUrl: c.logo_url || `https://ui-avatars.com/api/?name=${c.name}&background=1e293b&color=fff`,
      status: c.status
    }));
  } catch (error: any) {
    if (error.message === 'COMPANIES_TABLE_NOT_FOUND') throw error;
    return [];
  }
};

export const createCompany = async (company: Omit<Company, 'id'>): Promise<Company | null> => {
  try {
    // Mükerrer Kontrolü (İsim)
    const { data: existing } = await supabase
      .from('bots_companies')
      .select('id')
      .eq('name', company.name)
      .maybeSingle();

    if (existing) {
      throw new Error('DUPLICATE_RECORD');
    }

    const { data, error } = await supabase
      .from('bots_companies')
      .insert([{
        name: company.name,
        industry: company.industry,
        location: company.location,
        employees: company.employees,
        revenue: company.revenue,
        logo_url: company.logoUrl,
        status: company.status
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      industry: data.industry,
      location: data.location,
      employees: data.employees,
      revenue: data.revenue,
      logoUrl: data.logo_url,
      status: data.status
    };
  } catch (error: any) {
    if (error.message === 'DUPLICATE_RECORD') throw error;
    return null;
  }
};
