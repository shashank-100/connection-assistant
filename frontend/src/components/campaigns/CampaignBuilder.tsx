"use client";

import { useState } from 'react';
import { SequenceStep } from '@/types/campaign';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { defaultSequences } from '@/data/mockCampaigns';
import { Check, AlertCircle, Copy, Minus, Trash2, RefreshCw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CampaignBuilder() {
  const [sequences, setSequences] = useState<SequenceStep[]>(defaultSequences);
  const [recipientSource, setRecipientSource] = useState('list_of_leads');
  const [selectedList, setSelectedList] = useState('referral');
  const [excludeInNetwork, setExcludeInNetwork] = useState(false);
  const [currentRunningStepId, setCurrentRunningStepId] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();
  const recipientCount = 40;

  const toggleSequence = (id: string) => {
    setSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    toast({
      title: "Campaign Started",
      description: "Running sequence of LinkedIn tasks...",
    });

    try {
      const enabledTasks = sequences.filter(s => s.enabled).sort((a, b) => a.order - b.order);
      
      for (const task of enabledTasks) {
        setCurrentRunningStepId(task.id);
        let action = '';
        const params: any = { searchTerm: selectedList || 'software engineer' };

        switch (task.type) {
          case 'visit_profile':
            action = 'visit';
            params.max = 5;
            break;
          case 'connection_request':
            action = 'search';
            break;
          case 'send_message':
            action = 'message';
            params.message = "Hi {name}, I noticed your profile and would love to connect!";
            break;
          default:
            continue;
        }

        if (action) {
          const res = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, params })
          });
          const result = await res.json();
          if (!result.success) {
            toast({
              title: `Task Failed: ${task.label}`,
              description: result.error,
              variant: "destructive"
            });
            break; 
          }
        }
      }

      toast({
        title: "Campaign Complete",
        description: "Finished all sequence tasks.",
      });
    } catch (error) {
      toast({
        title: "System Error",
        description: "Communication with agent backend failed.",
        variant: "destructive"
      });
    } finally {
      setIsLaunching(false);
      setCurrentRunningStepId(null);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <div className="w-5 h-5 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sequences</span>
              <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              {recipientCount} recipients
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Auto-generated Pipeline</span>
            </div>
          </div>

          <div className="p-2">
            {sequences.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-md mb-1',
                  step.type === 'send_message' && step.enabled && 'bg-destructive/5',
                  currentRunningStepId === step.id && 'bg-primary/5 ring-1 ring-primary/20'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.label}</span>
                  {currentRunningStepId === step.id && (
                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                  )}
                  {step.hasWarning && step.enabled && (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                {step.type === 'visit_profile' || step.type === 'follow_member' || 
                 step.type === 'like_post' || step.type === 'connection_request' ? (
                  <Switch
                    checked={step.enabled}
                    onCheckedChange={() => toggleSequence(step.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                ) : step.id === '1' ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Switch
                    checked={step.enabled}
                    onCheckedChange={() => toggleSequence(step.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold">New campaign</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Minus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="outline">Save draft</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 gap-2" 
              onClick={handleLaunch}
              disabled={isLaunching}
            >
              {isLaunching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Launch
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-lg font-medium mb-4">Recipients</h2>
          
          <div className="bg-accent/50 border border-accent rounded-md p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Recipients who might be already in a running campaign won't be already in a running campaign won't be added to this campaign
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <label className="text-sm font-medium w-16">From</label>
              <Select value={recipientSource} onValueChange={setRecipientSource}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list_of_leads">List of leads</SelectItem>
                  <SelectItem value="search">Search results</SelectItem>
                  <SelectItem value="csv">CSV import</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-8">
              <label className="text-sm font-medium w-16">List</label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="referral">referral</SelectItem>
                  <SelectItem value="all_leads">All leads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-8">
              <label className="text-sm font-medium flex-1 max-w-md">
                Exclude contacts (already in your network or in your inbox or in pipeline)
              </label>
              <Switch
                checked={excludeInNetwork}
                onCheckedChange={setExcludeInNetwork}
              />
            </div>

            <div className="flex items-center gap-8">
              <label className="text-sm font-medium">Exclude members with a Label</label>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
