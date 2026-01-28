"use client";
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, User, ExternalLink, Play, CheckCircle2, Clock } from 'lucide-react';

interface LeadDetailListProps {
  source: string;
  sourceName: string;
}

export function LeadDetailList({ source, sourceName }: LeadDetailListProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://courteous-empathy-production-9e68.up.railway.app/api/leads?userId=shashank&source=${source}`);
        const data = await response.json();
        if (data.success) {
          setLeads(data.data);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, [source]);

  const getStepLabel = (lead: any) => {
    if (!lead.campaign_name) return null;
    
    const steps = lead.campaign_steps || [];
    const currentStepIndex = lead.current_step || 0;
    const currentStep = steps[currentStepIndex];
    
    if (!currentStep) return "Completed";
    
    return `Step ${currentStepIndex + 1}: ${currentStep.label || currentStep.type}`;
  };

  const getCampaignBadge = (lead: any) => {
    switch (lead.campaign_status) {
      case 'processing':
        return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><Play className="w-3 h-3" /> Processing</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="grid grid-cols-[1fr_200px_200px_100px_40px] gap-4 items-center px-6 py-2 border-b border-border bg-surface text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Lead Info</div>
        <div>Campaign</div>
        <div>Current Step</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">No leads in this list</div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="grid grid-cols-[1fr_200px_200px_100px_40px] gap-4 items-center px-6 py-3 border-b border-border hover:bg-row-hover transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {lead.profile_picture ? (
                    <img src={lead.profile_picture} alt={lead.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{lead.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.title}</p>
                </div>
                {lead.profile_url && (
                  <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="text-sm font-medium text-foreground truncate">
                {lead.campaign_name || '-'}
              </div>

              <div className="text-sm text-muted-foreground truncate">
                {getStepLabel(lead) || '-'}
              </div>

              <div>
                {getCampaignBadge(lead)}
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
