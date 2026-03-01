import { Campaign, SequenceStep } from '@/types/campaign';

export const defaultSequences: SequenceStep[] = [
  { id: '1', type: 'view_profile', label: 'View profile', enabled: true, order: 1 },
  { id: '2', type: 'follow_contact', label: 'Follow contact', enabled: true, order: 2 },
  { id: '3', type: 'engage_post', label: "Engage with post", enabled: true, order: 3 },
  { id: '4', type: 'send_invite', label: 'Send invite', enabled: true, order: 4 },
  { id: '5', type: 'send_message', label: 'Send message', enabled: true, order: 5, hasWarning: true },
  { id: '6', type: 'follow_up', label: 'Follow-up message 1', enabled: true, order: 6, hasWarning: true },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Outreach',
    status: 'running',
    recipientCount: 40,
    recipientSource: 'list_of_leads',
    listName: 'referral',
    excludeInNetwork: false,
    excludeLabels: [],
    sequences: defaultSequences,
    createdAt: '2026-01-15',
  },
];
