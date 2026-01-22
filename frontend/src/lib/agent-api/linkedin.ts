import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

const AGENT_DIR = process.env.AGENT_DIR || path.resolve(process.cwd(), '..');

export interface AgentActionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class LinkedInAgentAPI {
  private static async runCommand(
    scriptName: string,
    args: string[] = []
  ): Promise<AgentActionResponse> {
    try {
      const command = `node ${scriptName} ${args.join(' ')}`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: AGENT_DIR,
      });

      return {
        success: true,
        message: stdout,
        data: { stderr },
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to execute agent command',
        error: error.message,
      };
    }
  }

  static async searchPeople(searchTerm: string): Promise<AgentActionResponse> {
    return this.runCommand('linkedin-agent.js', [JSON.stringify(searchTerm), '--auto']);
  }

  static async checkAuthStatus(): Promise<AgentActionResponse> {
    try {
      const command = `./bin/agent-browser --session linkedin-agent get url`;
      const { stdout } = await execAsync(command, { cwd: AGENT_DIR });
      const url = stdout.trim();
      const isLoggedIn = url.includes('feed') || url.includes('mynetwork') || url.includes('in/');

      return {
        success: true,
        message: isLoggedIn ? 'Authenticated' : 'Not authenticated',
        data: { isLoggedIn, url },
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Could not verify auth status',
        data: { isLoggedIn: false },
        error: error.message,
      };
    }
  }

  static async openLogin(): Promise<AgentActionResponse> {
    return this.runCommand('linkedin-agent.js', ['--login-only']);
  }

  static async visitProfiles(searchTerm: string, max: number = 10): Promise<AgentActionResponse> {
    return this.runCommand('linkedin-profile-visitor.js', [
      JSON.stringify(searchTerm),
      `--max ${max}`,
      '--auto',
    ]);
  }

  static async scrapeLeads(searchTerm: string, max: number = 25): Promise<AgentActionResponse> {
    return this.runCommand('linkedin-scraper.js', [
      JSON.stringify(searchTerm),
      `--max ${max}`,
      '--auto',
    ]);
  }

  static async sendMessages(
    message: string,
    filter?: string,
    max: number = 5
  ): Promise<AgentActionResponse> {
    const args = [`--message "${message}"`, `--max ${max}`, '--auto'];
    if (filter) args.push(`--filter "${filter}"`);
    return this.runCommand('linkedin-messenger.js', args);
  }

  static async getAnalytics(): Promise<AgentActionResponse> {
    try {
      const analyticsPath = path.join(AGENT_DIR, 'linkedin-data/analytics.json');
      if (fs.existsSync(analyticsPath)) {
        const data = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
        return { success: true, message: 'Analytics fetched', data };
      }
      return { success: false, message: 'Analytics file not found' };
    } catch (error: any) {
      return { success: false, message: 'Error reading analytics', error: error.message };
    }
  }
}
