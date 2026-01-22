export interface Contact {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  connectionDate: string;
  sentByMe: boolean;
  isRead: boolean;
  hasReplied: boolean;
  labels: string[];
  pipeline: string;
  notes: string;
  reminder?: string;
}

export type FilterTab = 'all' | 'unread' | 'sent-by-member' | 'sent-by-me' | 'never-answered';
