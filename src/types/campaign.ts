export interface SequenceStep {
  id: string;
  type: 'view_profile' | 'follow_contact' | 'engage_post' | 'send_invite' | 'send_message' | 'follow_up';
  label: string;
  enabled: boolean;
  order: number;
  hasWarning?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  recipientCount: number;
  recipientSource: 'list_of_leads' | 'search' | 'csv';
  listName?: string;
  excludeInNetwork: boolean;
  excludeLabels: string[];
  sequences: SequenceStep[];
  createdAt: string;
}
