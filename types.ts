
export enum LeadStatus {
  NEW = 'New Lead',
  CONTACTED = 'Contacted',
  MEETING = 'Meeting Scheduled',
  OFFER = 'Offer Sent',
  WON = 'Won',
  LOST = 'Lost'
}

export enum Source {
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'WhatsApp',
  MANUAL = 'Manual',
  ADS = 'Ads'
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: Source;
  status: LeadStatus;
  value: number;
  tags: string[];
  lastActivity: string; // ISO Date
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  assignedTo: string;
  leadId?: string;
}

export interface RevenueData {
  name: string;
  revenue: number;
  pipeline: number;
}

// NEW TYPES
export interface Contact {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  companyId: string;
  avatarUrl: string;
  status: 'Active' | 'Inactive';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  employees: string;
  revenue: string;
  logoUrl: string;
  status: 'Partner' | 'Prospect' | 'Client';
}

export enum Tab {
  DASHBOARD = 'Dashboard',
  INBOX = 'Inbox',
  LEADS = 'Leads',
  PIPELINE = 'Pipeline',
  CONTACTS = 'Contacts',
  COMPANIES = 'Companies',
  TASKS = 'Tasks',
  CALLS = 'Calls',
  EMAILS = 'Emails',
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'WhatsApp',
  TELEGRAM = 'Telegram',
  ANALYTICS = 'Analytics',
  SETTINGS = 'Settings'
}
