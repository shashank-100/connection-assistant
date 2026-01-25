import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

const AGENT_DIR = process.env.AGENT_DIR || path.resolve(process.cwd(), '..');
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://courteous-empathy-production-9e68.up.railway.app';

export interface AgentActionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class LinkedInAgentAPI {
  private static async runRailwayAction(
    action: string,
    userId: string,
    params: any = {}
  ): Promise<AgentActionResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId,
          ...params,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return {
          success: true,
          message: `${action} completed successfully`,
          data: data.data,
        };
      } else {
        return {
          success: false,
          message: data.error || `Failed to execute ${action}`,
          error: data.error,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to communicate with Railway backend',
        error: error.message,
      };
    }
  }

  static async searchPeople(searchTerm: string, userId: string = 'shashank'): Promise<AgentActionResponse> {
    return this.runRailwayAction('linkedin-search', userId, { searchTerm });
  }

  static async checkAuthStatus(userId: string = 'shashank'): Promise<AgentActionResponse> {
    return this.runRailwayAction('linkedin-me', userId);
  }

  static async openLogin(): Promise<AgentActionResponse> {
    return {
      success: false,
      message: 'Manual login not supported via Railway backend. Please provide valid cookies.',
    };
  }

  static async visitProfiles(searchTerm: string, userId: string = 'shashank', max: number = 10): Promise<AgentActionResponse> {
    return this.runRailwayAction('linkedin-visit', userId, { searchTerm, max });
  }

  static async scrapeLeads(searchTerm: string, userId: string = 'shashank', max: number = 25): Promise<AgentActionResponse> {
    return this.runRailwayAction('linkedin-search', userId, { searchTerm, max });
  }

  static async sendMessages(
    message: string,
    filter?: string,
    max: number = 5
  ): Promise<AgentActionResponse> {
    return {
      success: false,
      message: 'Bulk messaging needs mapping to individual profileUrl actions on backend',
    };
  }

  static async getAnalytics(): Promise<AgentActionResponse> {
    return {
      success: true,
      message: 'Analytics fetched (Mock)',
      data: {
        totalSearched: 150,
        totalVisited: 85,
        totalConnected: 42,
        totalMessaged: 12
      }
    };
  }
}
