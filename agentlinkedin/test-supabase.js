import 'dotenv/config';
import { saveCookies, getCookies, saveLeads, getLeads, getLeadStats } from './db-supabase.js';

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Save cookies
    console.log('Test 1: Saving cookies...');
    const testCookies = [
      { name: 'li_at', value: 'test_value_123' },
      { name: 'JSESSIONID', value: 'ajax:test_session' }
    ];
    await saveCookies('test_user', testCookies);
    console.log('✅ Cookies saved\n');

    // Test 2: Get cookies
    console.log('Test 2: Getting cookies...');
    const retrievedCookies = await getCookies('test_user');
    console.log('✅ Cookies retrieved:', retrievedCookies?.length, 'cookies\n');

    // Test 3: Save leads
    console.log('Test 3: Saving leads...');
    const testLeads = [
      {
        id: 'lead_001',
        name: 'John Doe',
        title: 'Software Engineer',
        company: 'Tech Corp',
        profileUrl: 'https://linkedin.com/in/johndoe',
        profilePicture: 'https://example.com/pic.jpg',
        status: 'not_started',
        source: 'test_import'
      },
      {
        id: 'lead_002',
        name: 'Jane Smith',
        title: 'Product Manager',
        company: 'Innovation Inc',
        profileUrl: 'https://linkedin.com/in/janesmith',
        profilePicture: 'https://example.com/pic2.jpg',
        status: 'not_started',
        source: 'test_import'
      }
    ];
    await saveLeads('test_user', testLeads);
    console.log('✅ Leads saved\n');

    // Test 4: Get leads
    console.log('Test 4: Getting leads...');
    const leads = await getLeads('test_user');
    console.log('✅ Retrieved', leads.length, 'leads\n');

    // Test 5: Get lead stats
    console.log('Test 5: Getting lead stats...');
    const stats = await getLeadStats('test_user');
    console.log('✅ Stats:', stats, '\n');

    console.log('🎉 All tests passed! Supabase is working correctly.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSupabase();
