export interface LeadVariable {
  id: string;
  name: string;
  enabled: boolean;
  fallback?: string;
  fallbackPlaceholder?: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'prompt' | 'message';
  promptModel?: string;
  content: string;
  variables: LeadVariable[];
  createdAt: string;
}
