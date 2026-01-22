export interface SequenceStep {
  id: string;
  type: 'visit_profile' | 'follow_member' | 'like_post' | 'connection_request' | 'send_message' | 'follow_up';
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
