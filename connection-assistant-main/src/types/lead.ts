export interface LeadList {
  id: string;
  name: string;
  source: 'linkedin' | 'csv' | 'search';
  memberCount: number;
  totalCapacity: number;
  importedAt: string;
  status: 'sent' | 'sending' | 'paused' | 'not_started';
}

export interface LeadStats {
  totalImportedLists: number;
  totalImportedLeads: number;
  monthlyImports: { used: number; total: number };
  emailCredits: number;
  dailyQuotaLinkedIn: { used: number; total: number };
}
