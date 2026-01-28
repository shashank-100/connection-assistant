export interface Lead {
  id: string;
  name: string;
  title?: string;
  company?: string;
  profileUrl: string;
  profilePicture?: string;
  status: string;
  source: string;
  sourceName?: string;
  created_at?: string;
  sentAt?: string;
}

export interface LeadList {
  id: string;
  name: string;
  source?: string;
  memberCount: number;
  totalCapacity: number;
  importedAt: string;
  status: 'sent' | 'sending' | 'paused' | 'not_started' | 'active';
}

export interface LeadStats {
  totalImportedLists: number;
  totalImportedLeads: number;
  monthlyImports: { used: number; total: number };
  emailCredits: number;
  dailyQuotaLinkedIn: { used: number; total: number };
}
