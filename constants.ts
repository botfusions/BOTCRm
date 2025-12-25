
import { Lead, LeadStatus, Source, Task, RevenueData, Contact, Company } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    fullName: 'Elara Vane',
    email: 'elara@example.com',
    phone: '+1 555 0101',
    source: Source.INSTAGRAM,
    status: LeadStatus.NEW,
    value: 1200,
    tags: ['VIP', 'Hot'],
    lastActivity: '2023-12-15T10:30:00Z',
    avatarUrl: 'https://ui-avatars.com/api/?name=Elara+Vane&background=6366f1&color=fff'
  },
  {
    id: '2',
    fullName: 'Jaxon Kade',
    email: 'jaxon@studio.io',
    phone: '+1 555 0202',
    source: Source.WHATSAPP,
    status: LeadStatus.CONTACTED,
    value: 3500,
    tags: ['Corporate'],
    lastActivity: '2023-12-14T15:45:00Z',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jaxon+Kade&background=10b981&color=fff'
  },
  {
    id: '3',
    fullName: 'Lyra Belacqua',
    email: 'lyra@north.com',
    phone: '+1 555 0303',
    source: Source.ADS,
    status: LeadStatus.OFFER,
    value: 8500,
    tags: ['Retainer', 'Urgent'],
    lastActivity: '2023-12-15T09:00:00Z',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lyra+Belacqua&background=f59e0b&color=fff'
  },
  {
    id: '4',
    fullName: 'Caleb Widogast',
    email: 'caleb@empire.net',
    phone: '+1 555 0404',
    source: Source.MANUAL,
    status: LeadStatus.WON,
    value: 12000,
    tags: ['Referral'],
    lastActivity: '2023-12-10T11:20:00Z',
    avatarUrl: 'https://ui-avatars.com/api/?name=Caleb+Widogast&background=ec4899&color=fff'
  },
  {
    id: '5',
    fullName: 'Fjord Stone',
    email: 'fjord@sea.com',
    phone: '+1 555 0505',
    source: Source.INSTAGRAM,
    status: LeadStatus.MEETING,
    value: 2400,
    tags: ['Cold'],
    lastActivity: '2023-12-13T14:10:00Z',
    avatarUrl: 'https://ui-avatars.com/api/?name=Fjord+Stone&background=8b5cf6&color=fff'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Send welcome kit to Elara',
    completed: false,
    dueDate: '2023-12-16',
    assignedTo: 'Admin',
    leadId: '1'
  },
  {
    id: 't2',
    title: 'Prepare contract for Lyra',
    completed: false,
    dueDate: '2023-12-15',
    assignedTo: 'Admin',
    leadId: '3'
  },
  {
    id: 't3',
    title: 'Monthly revenue audit',
    completed: true,
    dueDate: '2023-12-01',
    assignedTo: 'Finance'
  }
];

export const REVENUE_DATA: RevenueData[] = [
  { name: 'Mon', revenue: 4000, pipeline: 2400 },
  { name: 'Tue', revenue: 3000, pipeline: 1398 },
  { name: 'Wed', revenue: 2000, pipeline: 9800 },
  { name: 'Thu', revenue: 2780, pipeline: 3908 },
  { name: 'Fri', revenue: 1890, pipeline: 4800 },
  { name: 'Sat', revenue: 2390, pipeline: 3800 },
  { name: 'Sun', revenue: 3490, pipeline: 4300 },
];

export const PIPELINE_COLUMNS = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.MEETING,
  LeadStatus.OFFER,
  LeadStatus.WON
];

export const MOCK_CONTACTS: Contact[] = [
    {
        id: 'c1',
        fullName: 'Sarah Connor',
        title: 'CTO',
        email: 'sarah@skynet.com',
        phone: '+1 555 8888',
        companyId: 'comp1',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=0ea5e9&color=fff',
        status: 'Active'
    },
    {
        id: 'c2',
        fullName: 'Bruce Wayne',
        title: 'CEO',
        email: 'bruce@wayne.corp',
        phone: '+1 555 9999',
        companyId: 'comp2',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bruce+Wayne&background=1e293b&color=fff',
        status: 'Active'
    },
    {
        id: 'c3',
        fullName: 'Tony Stark',
        title: 'Lead Engineer',
        email: 'tony@stark.ind',
        phone: '+1 555 7777',
        companyId: 'comp3',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tony+Stark&background=ef4444&color=fff',
        status: 'Inactive'
    },
    {
        id: 'c4',
        fullName: 'Diana Prince',
        title: 'Curator',
        email: 'diana@themiscira.museum',
        phone: '+1 555 6666',
        companyId: 'comp4',
        avatarUrl: 'https://ui-avatars.com/api/?name=Diana+Prince&background=f59e0b&color=fff',
        status: 'Active'
    }
];

export const MOCK_COMPANIES: Company[] = [
    {
        id: 'comp1',
        name: 'Cyberdyne Systems',
        industry: 'Robotics',
        location: 'California, USA',
        employees: '5,000+',
        revenue: '$12B',
        logoUrl: 'https://ui-avatars.com/api/?name=CS&background=334155&color=fff',
        status: 'Client'
    },
    {
        id: 'comp2',
        name: 'Wayne Enterprises',
        industry: 'Conglomerate',
        location: 'Gotham, USA',
        employees: '100,000+',
        revenue: '$90B',
        logoUrl: 'https://ui-avatars.com/api/?name=WE&background=111827&color=fff',
        status: 'Partner'
    },
    {
        id: 'comp3',
        name: 'Stark Industries',
        industry: 'Defense/Tech',
        location: 'New York, USA',
        employees: '25,000+',
        revenue: '$50B',
        logoUrl: 'https://ui-avatars.com/api/?name=SI&background=b91c1c&color=fff',
        status: 'Prospect'
    }
];
