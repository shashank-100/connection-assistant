import { LeadList, LeadStats } from '@/types/lead';

export const mockLeadLists: LeadList[] = [
  {
    id: '1',
    name: 'All leads',
    source: 'linkedin',
    memberCount: 0,
    totalCapacity: 0,
    duplicates: null,
    match: null,
    importedAt: '',
    enrichedEmails: '',
    status: 'active',
  },
  {
    id: '2',
    name: 'referral',
    source: 'linkedin',
    memberCount: 40,
    totalCapacity: 1000,
    duplicates: null,
    match: null,
    importedAt: 'January 20, 2026 3:59 ...',
    enrichedEmails: 'To enrich',
    status: 'paused',
  },
];

export const mockLeadStats: LeadStats = {
  totalImportedLists: 1,
  totalImportedLeads: 40,
  monthlyImports: { used: 30, total: 1000 },
  emailCredits: 30,
  dailyQuotaLinkedIn: { used: 0, total: 30 },
};
