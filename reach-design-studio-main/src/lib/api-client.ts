const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const USER_ID = import.meta.env.VITE_USER_ID || 'shashank';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

class ApiClient {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl: string = API_BASE_URL, userId: string = USER_ID) {
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Leads API
  async getLeads() {
    return this.request<any[]>(`/api/leads?userId=${this.userId}`);
  }

  async getLeadLists() {
    return this.request<any[]>(`/api/leads?userId=${this.userId}&action=lists`);
  }

  async addLeads(leads: any[]) {
    return this.request<{ count: number; message: string }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify({ userId: this.userId, leads }),
    });
  }

  async deleteLeadsBySource(source: string) {
    return this.request('/api/leads', {
      method: 'DELETE',
      body: JSON.stringify({ userId: this.userId, source }),
    });
  }

  // Campaigns API
  async getCampaigns() {
    return this.request<any[]>(`/api/campaigns?userId=${this.userId}`);
  }

  async saveCampaign(campaign: any) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({ userId: this.userId, ...campaign }),
    });
  }

  async launchCampaign(campaignId: string, options: { source?: string; leadIds?: string[] }) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        action: 'launch',
        campaignId,
        ...options,
      }),
    });
  }

  async startCampaign(campaignId: string) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        action: 'start',
        campaignId,
      }),
    });
  }

  async pauseCampaign(campaignId: string) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        action: 'pause',
        campaignId,
      }),
    });
  }

  async resumeCampaign(campaignId: string) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        action: 'resume',
        campaignId,
      }),
    });
  }

  // LinkedIn Accounts API
  async getLinkedInAccounts() {
    return this.request<any[]>(`/api/linkedin-accounts?userId=${this.userId}`);
  }

  async addLinkedInAccount(label: string, cookies: any[]) {
    return this.request('/api/linkedin-accounts', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        label,
        cookies,
      }),
    });
  }

  async deleteLinkedInAccount(accountId: string) {
    return this.request(`/api/linkedin-accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // Browser Actions API
  async executeBrowserAction(action: string, params: any = {}) {
    return this.request('/api', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        action,
        ...params,
      }),
    });
  }
}

export const apiClient = new ApiClient();
