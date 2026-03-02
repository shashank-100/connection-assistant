import 'dotenv/config';
import { readFileSync } from 'fs';
import { saveCookies } from './db-supabase.js';

const USER_ID = process.argv[2] || 'shashank';

const netscape = readFileSync('./cookies_netscape.txt', 'utf-8');
const cookies = [];

for (const line of netscape.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const parts = trimmed.split('\t');
  if (parts.length < 7) continue;

  const [domain, httpOnlyStr, path, secureStr, expiryStr, name, ...valueParts] = parts;
  const value = valueParts.join('\t');

  cookies.push({
    name,
    value,
    domain,
    path,
    expires: parseInt(expiryStr, 10) || -1,
    httpOnly: false,
    secure: secureStr === 'TRUE',
    sameSite: 'Lax',
  });
}

console.log(`Parsed ${cookies.length} cookies from cookies_netscape.txt`);
['li_at', 'JSESSIONID', 'bcookie', 'bscookie'].forEach(name => {
  const c = cookies.find(c => c.name === name);
  if (c) console.log(`  ${name}: ${c.value.substring(0, 40)}...`);
});

await saveCookies(USER_ID, cookies);
console.log(`\n✅ Cookies uploaded to Supabase for user: ${USER_ID}`);
