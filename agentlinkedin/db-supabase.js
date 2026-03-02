import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://zywelnojvoaieeesqafi.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY environment variable is required');
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Initialize database schema (schema should be run manually in Supabase SQL Editor)
export async function initDB() {
  console.log('[DB] Connected to Supabase database');
  console.log('[DB] Run supabase-schema.sql in Supabase SQL Editor to create tables');
  return { success: true };
}

// Save or update user cookies
export async function saveCookies(userId, cookies) {
  try {
    const { error } = await supabase
      .from('user_cookies')
      .upsert({
        user_id: userId,
        cookies: cookies,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    console.log(`[DB] Saved cookies for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving cookies:', err);
    throw err;
  }
}

// Get user cookies
export async function getCookies(userId) {
  try {
    const { data, error } = await supabase
      .from('user_cookies')
      .select('cookies')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

    return data?.cookies || null;
  } catch (err) {
    console.error('[DB] Error getting cookies:', err);
    throw err;
  }
}

// Delete user cookies
export async function deleteCookies(userId) {
  try {
    const { error } = await supabase
      .from('user_cookies')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    console.log(`[DB] Deleted cookies for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error deleting cookies:', err);
    throw err;
  }
}

// Delete leads by source
export async function deleteLeadsBySource(userId, source) {
  try {
    const { error, count } = await supabase
      .from('leads')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .eq('source', source);

    if (error) throw error;

    console.log(`[DB] Deleted ${count} leads for user: ${userId} with source: ${source}`);
    return { success: true, count: count || 0 };
  } catch (err) {
    console.error('[DB] Error deleting leads:', err);
    throw err;
  }
}

// Delete campaign leads by source
export async function deleteCampaignLeadsBySource(userId, source) {
  try {
    // First get lead IDs with the source
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', userId)
      .eq('source', source);

    if (leadsError) throw leadsError;

    if (!leads || leads.length === 0) {
      return { success: true, count: 0 };
    }

    const leadIds = leads.map(l => l.id);

    // Delete campaign_leads with those lead IDs
    const { error, count } = await supabase
      .from('campaign_leads')
      .delete({ count: 'exact' })
      .in('lead_id', leadIds);

    if (error) throw error;

    console.log(`[DB] Deleted ${count} campaign leads for user: ${userId} with source: ${source}`);
    return { success: true, count: count || 0 };
  } catch (err) {
    console.error('[DB] Error deleting campaign leads:', err);
    throw err;
  }
}

// Save or update leads
export async function saveLeads(userId, leads) {
  try {
    const leadsData = leads.map(lead => ({
      id: lead.id,
      user_id: userId,
      name: lead.name,
      title: lead.title || lead.headline,
      company: lead.company,
      profile_url: lead.profileUrl,
      profile_picture: lead.profilePicture,
      status: lead.status || 'not_started',
      source: lead.source,
      sent_at: lead.sentAt,
      connected_at: lead.connectedAt,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('leads')
      .upsert(leadsData, {
        onConflict: 'id'
      });

    if (error) throw error;

    console.log(`[DB] Saved ${leads.length} leads for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving leads:', err);
    throw err;
  }
}

// Get all leads for a user with their campaign progress
export async function getLeads(userId, filters = {}) {
  try {
    let query = supabase
      .from('leads')
      .select(`
        *,
        campaign_leads (
          status,
          current_step,
          next_action_at,
          history,
          campaigns (
            name,
            steps
          )
        )
      `)
      .eq('user_id', userId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.source) {
      query = query.eq('source', filters.source);
    }

    query = query.order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the nested data to match the old structure
    const transformedData = data.map(lead => {
      const campaignLead = lead.campaign_leads?.[0];
      return {
        ...lead,
        campaign_status: campaignLead?.status,
        current_step: campaignLead?.current_step,
        next_action_at: campaignLead?.next_action_at,
        campaign_history: campaignLead?.history,
        campaign_name: campaignLead?.campaigns?.name,
        campaign_steps: campaignLead?.campaigns?.steps,
        campaign_leads: undefined // Remove the nested object
      };
    });

    return transformedData;
  } catch (err) {
    console.error('[DB] Error getting leads:', err);
    throw err;
  }
}

// Update lead status
export async function updateLeadStatus(leadId, status) {
  try {
    const { error } = await supabase
      .from('leads')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) throw error;

    console.log(`[DB] Updated lead ${leadId} status to ${status}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error updating lead status:', err);
    throw err;
  }
}

// Get lead statistics for a user
export async function getLeadStats(userId) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status, source')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total_leads: data.length,
      pending_requests: data.filter(l => l.status === 'pending').length,
      recent_connections: data.filter(l => l.status === 'connected').length,
      imported_leads: data.filter(l => l.source === 'csv_import').length
    };

    return stats;
  } catch (err) {
    console.error('[DB] Error getting lead stats:', err);
    throw err;
  }
}

// Get unique lead lists (sources) for a user
export async function getLeadLists(userId) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .eq('user_id', userId)
      .not('source', 'is', null);

    if (error) throw error;

    // Group by source and count
    const sourceMap = {};
    data.forEach(lead => {
      if (lead.source) {
        sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1;
      }
    });

    const result = Object.entries(sourceMap).map(([source, count]) => ({
      source,
      source_name: source,
      count
    }));

    result.sort((a, b) => b.count - a.count);

    return result;
  } catch (err) {
    console.error('[DB] Error getting lead lists:', err);
    throw err;
  }
}

// --- CAMPAIGN FUNCTIONS ---

export async function saveCampaign(userId, campaignData) {
  try {
    const { id, name, status, steps, settings } = campaignData;

    const { error } = await supabase
      .from('campaigns')
      .upsert({
        id,
        user_id: userId,
        name,
        status,
        steps,
        settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;

    console.log(`[DB] Saved campaign: ${name} (${id})`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving campaign:', err);
    throw err;
  }
}

export async function addLeadsToCampaign(userId, campaignId, leadIds) {
  try {
    let addedCount = 0;

    for (const leadId of leadIds) {
      // Check if lead exists first
      const { data: leadCheck } = await supabase
        .from('leads')
        .select('id')
        .eq('id', leadId)
        .single();

      if (!leadCheck) continue;

      const id = `${campaignId}_${leadId}`;

      const { error } = await supabase
        .from('campaign_leads')
        .upsert({
          id,
          campaign_id: campaignId,
          lead_id: leadId,
          user_id: userId,
          status: 'pending',
          current_step: 0,
          next_action_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'campaign_id,lead_id', ignoreDuplicates: true });

      if (!error) addedCount++;
    }

    console.log(`[DB] Added ${addedCount} leads to campaign ${campaignId}`);
    return { success: true, count: addedCount };
  } catch (err) {
    console.error('[DB] Error adding leads to campaign:', err);
    throw err;
  }
}

export async function getPendingCampaignActions(userId) {
  try {
    const { data, error } = await supabase
      .from('campaign_leads')
      .select(`
        *,
        campaigns (steps),
        leads (profile_url, name)
      `)
      .eq('user_id', userId)
      .in('status', ['pending', 'processing'])
      .lte('next_action_at', new Date().toISOString())
      .order('next_action_at', { ascending: true })
      .limit(5);

    if (error) throw error;

    // Filter for active campaigns
    const activeCampaigns = await supabase
      .from('campaigns')
      .select('id')
      .eq('status', 'active');

    const activeCampaignIds = new Set(activeCampaigns.data?.map(c => c.id) || []);

    // Transform and filter results
    const transformedData = data
      .filter(cl => activeCampaignIds.has(cl.campaign_id))
      .map(cl => ({
        ...cl,
        steps: cl.campaigns?.steps,
        profile_url: cl.leads?.profile_url,
        lead_name: cl.leads?.name,
        campaigns: undefined,
        leads: undefined
      }));

    return transformedData;
  } catch (err) {
    console.error('[DB] Error getting pending actions:', err);
    throw err;
  }
}

export async function updateCampaignLeadStatus(id, updates) {
  try {
    const { status, current_step, next_action_at, historyEntry } = updates;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (current_step !== undefined) updateData.current_step = current_step;
    if (next_action_at) updateData.next_action_at = next_action_at;

    // If historyEntry, we need to append it to the existing history
    if (historyEntry) {
      // First get current history
      const { data: current } = await supabase
        .from('campaign_leads')
        .select('history')
        .eq('id', id)
        .single();

      const currentHistory = current?.history || [];
      updateData.history = [...currentHistory, historyEntry];
    }

    const { error } = await supabase
      .from('campaign_leads')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('[DB] Error updating campaign lead:', err);
    throw err;
  }
}

// --- CAMPAIGN WORKER FUNCTIONS ---

export async function getActiveCampaigns() {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('[DB] Error getting active campaigns:', err);
    throw err;
  }
}

// STEP 4: Atomic update to prevent double-sends
export async function getNextPendingProspect(campaignId) {
  try {
    // Get one pending prospect
    const { data: prospect, error: prospectError } = await supabase
      .from('campaign_leads')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (prospectError && prospectError.code !== 'PGRST116') throw prospectError;
    if (!prospect) return null;

    // Update to processing
    const { error: updateError } = await supabase
      .from('campaign_leads')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', prospect.id)
      .eq('status', 'pending'); // Only update if still pending

    if (updateError) throw updateError;

    // Get lead info
    const { data: leadInfo } = await supabase
      .from('leads')
      .select('profile_url, name')
      .eq('id', prospect.lead_id)
      .single();

    return {
      ...prospect,
      profileUrl: leadInfo?.profile_url,
      leadName: leadInfo?.name
    };
  } catch (err) {
    console.error('[DB] Error getting next prospect:', err);
    throw err;
  }
}

export async function markProspectDone(id, historyEntry) {
  try {
    // Get current history
    const { data: current } = await supabase
      .from('campaign_leads')
      .select('history')
      .eq('id', id)
      .single();

    const currentHistory = current?.history || [];

    const { error } = await supabase
      .from('campaign_leads')
      .update({
        status: 'completed',
        history: [...currentHistory, historyEntry],
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('[DB] Error marking prospect done:', err);
    throw err;
  }
}

export async function markProspectFailed(id, error) {
  try {
    // Get current history
    const { data: current } = await supabase
      .from('campaign_leads')
      .select('history')
      .eq('id', id)
      .single();

    const currentHistory = current?.history || [];

    const { error: updateError } = await supabase
      .from('campaign_leads')
      .update({
        status: 'failed',
        history: [...currentHistory, { action: 'error', error, time: new Date() }],
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) throw updateError;
  } catch (err) {
    console.error('[DB] Error marking prospect failed:', err);
    throw err;
  }
}

// STEP 5: Check if campaign is finished
export async function checkAndCompleteCampaign(campaignId) {
  try {
    const { count, error } = await supabase
      .from('campaign_leads')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'pending');

    if (error) throw error;

    if (count === 0) {
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      console.log(`[DB] Campaign ${campaignId} marked as COMPLETED`);
      return true;
    }

    return false;
  } catch (err) {
    console.error('[DB] Error checking campaign completion:', err);
    throw err;
  }
}

export async function updateCampaignStatus(campaignId, status) {
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (error) throw error;

    console.log(`[DB] Campaign ${campaignId} status updated to: ${status}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error updating campaign status:', err);
    throw err;
  }
}

export async function getCampaigns(userId) {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[DB] Error getting campaigns:', err);
    throw err;
  }
}

export async function getCampaignStats(campaignId) {
  try {
    const { data, error } = await supabase
      .from('campaign_leads')
      .select('status')
      .eq('campaign_id', campaignId);

    if (error) throw error;

    const rows = data || [];
    return {
      total: rows.length,
      pending: rows.filter(r => r.status === 'pending').length,
      processing: rows.filter(r => r.status === 'processing').length,
      completed: rows.filter(r => r.status === 'completed').length,
      failed: rows.filter(r => r.status === 'failed').length,
    };
  } catch (err) {
    console.error('[DB] Error getting campaign stats:', err);
    throw err;
  }
}

export default supabase;
