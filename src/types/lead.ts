export interface LeadList {
  id: string;
  name: string;
  source: 'linkedin' | 'csv' | 'search';
  memberCount: number;
  totalCapacity: number;
  duplicates: number | null;
  match: number | null;
  importedAt: string;
  enrichedEmails: string;
  status: 'active' | 'paused' | 'to_enrich';
}

export interface LeadStats {
  totalImportedLists: number;
  totalImportedLeads: number;
  monthlyImports: { used: number; total: number };
  emailCredits: number;
  dailyQuotaLinkedIn: { used: number; total: number };
}
