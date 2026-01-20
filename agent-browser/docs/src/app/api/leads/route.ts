import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

function parseCSV(content: string): any[] {
  const rows: any[] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField);
      if (currentRow.some(field => field.trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Push last row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(field => field.trim())) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'referral_1-40.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse CSV properly handling quotes and multiline fields
    const rows = parseCSV(fileContent);
    const headers = rows[0].map((h: string) => h.trim());

    const contacts = rows.slice(1)
      .filter(row => row.length > 1 && row[0]?.trim()) // Filter valid rows with ID
      .map(row => {
        const contact: any = {};
        headers.forEach((header, index) => {
          contact[header] = row[index]?.trim() || '';
        });

        return {
          id: contact.id,
          name: `${contact.firstname_cleaned || contact.firstname} ${contact.lastname_cleaned || contact.lastname}`.trim(),
          firstname: contact.firstname_cleaned || contact.firstname,
          lastname: contact.lastname_cleaned || contact.lastname,
          linkedin_profile_url: contact.linkedin_profile_url,
          headline: contact.headline,
          location: contact.location,
          company: contact.company_cleaned || contact.company,
          picture: contact.picture,
          connections: parseInt(contact.connections) || 0,
          email: contact.email || contact.uploaded_email,
          phone: contact.phone || contact.uploaded_phone,
          industry: contact.industry,
          match: contact.match === 'True',
          spotlight: contact.spotlight,
        };
      });

    return NextResponse.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read CSV file' },
      { status: 500 }
    );
  }
}
