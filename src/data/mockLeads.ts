import { LeadList, LeadStats } from '@/types/lead';

export const mockLeadLists: LeadList[] = [
  {
    id: '1',
    name: 'All leads',
    source: 'platform',
    memberCount: 0,
    totalCapacity: 0,
    importedAt: '',
    status: 'not_started',
  },
  {
    id: '2',
    name: 'referral',
    source: 'platform',
    memberCount: 40,
    totalCapacity: 1000,
    importedAt: 'January 20, 2026 3:59 ...',
    status: 'sending',
  },
];

export const mockLeadStats: LeadStats = {
  totalImportedLists: 1,
  totalImportedLeads: 40,
  monthlyImports: { used: 30, total: 1000 },
  emailCredits: 30,
  dailyQuota: { used: 0, total: 30 },
};
