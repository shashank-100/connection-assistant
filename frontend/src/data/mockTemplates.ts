import { Template, LeadVariable } from '@/types/template';

export const defaultVariables: LeadVariable[] = [
  { id: '1', name: 'Firstname', enabled: true },
  { id: '2', name: 'Lastname', enabled: false },
  { id: '3', name: 'Headline', enabled: true },
  { id: '4', name: 'Biography', enabled: false },
  { id: '5', name: 'Job title', enabled: true, fallback: '', fallbackPlaceholder: 'Optional fallback (ex: manager)' },
  { id: '6', name: 'Company name', enabled: true, fallback: '', fallbackPlaceholder: 'Optional fallback (ex: a big company)' },
  { id: '7', name: 'Company overview', enabled: false, fallback: '', fallbackPlaceholder: 'Optional fallback (ex: a startup company)' },
  { id: '8', name: 'Location', enabled: false, fallback: '', fallbackPlaceholder: 'Optional fallback (ex: UK)' },
  { id: '9', name: 'Language', enabled: true, fallback: '', fallbackPlaceholder: 'Optional fallback (ex: English)' },
  { id: '10', name: 'Conversation', enabled: false },
];

export const defaultPromptContent = `You are an expert in B2B copywriting and LinkedIn outreach.
Propose a personalized first outreach message that is concise, engaging, and adapted to my business context and the target lead profile.

Take into account the following details:
- Business context: [Describe your context: business description, value proposition, industry, key benefits]
- Message objective: [get a reply, book a call, introduce the solution, etc.]
- Preferred tone/style: [friendly, professional, direct, subtle, etc.]

Format constraints:
- Keep the message short (40–90 words).
- Format with line breaks
- Avoid direct sales language (no "I sell," "free demo," etc.).
- Include a personalized hook related to the lead's context (industry, recent activity, role, etc.).
- End with a natural opener (a simple question or soft suggestion).
- Do not sign the message`;

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'referrl',
    type: 'prompt',
    promptModel: undefined,
    content: defaultPromptContent,
    variables: defaultVariables,
    createdAt: '2026-01-20',
  },
];
