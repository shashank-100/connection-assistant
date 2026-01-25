import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { saveLeads } from '../../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LinkedInLeadImportService {
  constructor(browser, userId = 'shashank') {
    this.browser = browser;
    this.userId = userId;
  }

  async getImportedLeads() {
    try {
      console.log('[LeadImport] Reading leads from leads_to_find.csv...');

      const csvPath = path.resolve(__dirname, '../../leads_to_find.csv');

      if (!fs.existsSync(csvPath)) {
        console.warn(`[LeadImport] File not found: ${csvPath}`);
        return [];
      }

      const fileContent = fs.readFileSync(csvPath, 'utf8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`[LeadImport] Successfully read ${records.length} leads`);

      const importedLeads = records.map((lead, index) => ({
        id: `imported_${Date.now()}_${index}`,
        name: lead.name || '',
        title: lead.headline || lead.title || '',
        company: lead.company || '',
        profileUrl: lead.linkedin_url || lead.profileUrl || '',
        status: 'not_started',
        source: 'csv_import'
      }));

      // Save imported leads to database
      if (importedLeads.length > 0) {
        try {
          await saveLeads(this.userId, importedLeads);
          console.log(`[LeadImport] Saved ${importedLeads.length} imported leads to database`);
        } catch (dbErr) {
          console.error('[LeadImport] Error saving to database:', dbErr);
        }
      }

      return importedLeads;
    } catch (error) {
      console.error('[LeadImport] Error reading leads:', error);
      throw error;
    }
  }
}
