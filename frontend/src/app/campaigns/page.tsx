"use client";
import { useState, useEffect } from 'react';
import { CampaignBuilder } from '@/components/campaigns/CampaignBuilder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Plus, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USER_ID = process.env.NEXT_PUBLIC_USER_ID || 'shashank';

interface CampaignStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  created_at: string;
  stats: CampaignStats;
}

function statusColor(status: string) {
  if (status === 'active') return 'bg-green-100 text-green-700';
  if (status === 'paused') return 'bg-yellow-100 text-yellow-700';
  if (status === 'completed') return 'bg-blue-100 text-blue-700';
  if (status === 'draft') return 'bg-gray-100 text-gray-600';
  return 'bg-gray-100 text-gray-600';
}

export default function CampaignsPage() {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns?userId=${USER_ID}`);
      const data = await res.json();
      if (data.success) setCampaigns(data.data);
    } catch {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') fetchCampaigns();
  }, [view]);

  const handlePauseResume = async (campaign: Campaign) => {
    const action = campaign.status === 'active' ? 'pause' : 'resume';
    try {
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, campaignId: campaign.id, userId: USER_ID }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Campaign ${action}d`);
        fetchCampaigns();
      }
    } catch {
      toast.error(`Failed to ${action} campaign`);
    }
  };

  if (view === 'builder') {
    return (
      <div className="h-[calc(100vh-49px)] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All campaigns
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CampaignBuilder />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <Button onClick={() => setView('builder')}>
          <Plus className="w-4 h-4 mr-1" />
          New campaign
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No campaigns yet</p>
          <Button onClick={() => setView('builder')}>
            <Plus className="w-4 h-4 mr-1" />
            Create your first campaign
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const { total, completed, failed, pending } = campaign.stats;
            const sent = completed + failed;
            const progress = total > 0 ? Math.round((sent / total) * 100) : 0;

            return (
              <div key={campaign.id} className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{campaign.name}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColor(campaign.status))}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span>{total} leads</span>
                      <span>{completed} sent</span>
                      {failed > 0 && <span className="text-destructive">{failed} failed</span>}
                      <span>{pending} pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">{progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {(campaign.status === 'active' || campaign.status === 'paused') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseResume(campaign)}
                        className="h-8"
                      >
                        {campaign.status === 'active' ? (
                          <><Pause className="w-3.5 h-3.5 mr-1" />Pause</>
                        ) : (
                          <><Play className="w-3.5 h-3.5 mr-1" />Resume</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
