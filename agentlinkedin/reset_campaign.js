import 'dotenv/config';
import supabase from './db-supabase.js';

// Reset all failed leads to pending
const { error: e1 } = await supabase
  .from('campaign_leads')
  .update({ status: 'pending', updated_at: new Date().toISOString() })
  .in('status', ['failed', 'processing']);

console.log('Reset failed/processing leads:', e1 || 'ok');

// Reset completed campaigns to active
const { error: e2 } = await supabase
  .from('campaigns')
  .update({ status: 'active', updated_at: new Date().toISOString() })
  .eq('status', 'completed');

console.log('Reset completed campaigns to active:', e2 || 'ok');
console.log('✅ Done - campaign is ready to run again');
