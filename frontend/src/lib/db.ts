import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/db.json');

export interface Lead {
  id: string;
  name: string;
  title: string;
  profileUrl: string;
  status: 'new' | 'connected' | 'messaged' | 'replied' | 'failed';
  campaignId?: string;
  lastActionDate?: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  searchTerm: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

interface DB {
  leads: Lead[];
  campaigns: Campaign[];
}

export class Database {
  private static ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ leads: [], campaigns: [] }));
    }
  }

  static get(): DB {
    this.ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }

  static save(data: DB) {
    this.ensureDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  static addLeads(leads: Lead[]) {
    const db = this.get();
    const existingUrls = new Set(db.leads.map(l => l.profileUrl));
    const newLeads = leads.filter(l => !existingUrls.has(l.profileUrl));
    db.leads.push(...newLeads);
    this.save(db);
  }

  static updateLeadStatus(id: string, status: Lead['status']) {
    const db = this.get();
    const lead = db.leads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      lead.lastActionDate = new Date().toISOString();
      this.save(db);
    }
  }
}
