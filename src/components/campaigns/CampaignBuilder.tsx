import { useState } from 'react';
import { SequenceStep } from '@/types/campaign';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultSequences } from '@/data/mockCampaigns';
import { Check, AlertCircle, Copy, Minus, Trash2, Play, Pause } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function CampaignBuilder() {
  const [sequences, setSequences] = useState<SequenceStep[]>(defaultSequences);
  const [recipientSource, setRecipientSource] = useState('list_of_leads');
  const [selectedList, setSelectedList] = useState('referral');
  const [excludeInNetwork, setExcludeInNetwork] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<SequenceStep | null>(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const toggleSequence = (id: string) => {
    setSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSequenceClick = (step: SequenceStep) => {
    setSelectedSequence(step);
    setShowRecipients(false);
  };

  const handleRecipientsClick = () => {
    setShowRecipients(true);
    setSelectedSequence(null);
  };

  const handleLaunchPause = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Sequences */}
      <div className="w-72 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sequences</span>
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Recipients item */}
          <div className="p-2 border-b border-border">
            <div
              onClick={handleRecipientsClick}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors',
                showRecipients && 'bg-accent'
              )}
            >
              <span className="text-sm">Recipients</span>
            </div>
          </div>

          {/* Sequence items */}
          <div className="p-2">
            {sequences.map((step) => (
              <div
                key={step.id}
                onClick={() => handleSequenceClick(step)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-md mb-1 cursor-pointer transition-colors',
                  step.type === 'send_message' && step.enabled && 'bg-destructive/5',
                  selectedSequence?.id === step.id && 'bg-accent'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.label}</span>
                  {step.hasWarning && step.enabled && (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold">New campaign</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="outline">Save draft</Button>
            <Button 
              className={cn(
                isRunning 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={handleLaunchPause}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Launch
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {showRecipients ? (
            <RecipientsSection
              recipientSource={recipientSource}
              setRecipientSource={setRecipientSource}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              excludeInNetwork={excludeInNetwork}
              setExcludeInNetwork={setExcludeInNetwork}
            />
          ) : selectedSequence ? (
            <SequenceDetail sequence={selectedSequence} />
          ) : (
            <div className="text-muted-foreground text-sm">
              Select a sequence step or recipients to configure
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SequenceDetail({ sequence }: { sequence: SequenceStep }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{sequence.label}</h2>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          sequence.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {sequence.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {(sequence.type === 'send_message' || sequence.type === 'follow_up') && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Message Template</label>
            <Textarea 
              placeholder="Write your message here..." 
              className="min-h-[150px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Delay (days)</label>
              <Input type="number" defaultValue={1} min={0} />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Send time</label>
              <Select defaultValue="morning">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {sequence.type === 'connection_request' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Connection Note (optional)</label>
            <Textarea 
              placeholder="Add a personalized note to your connection request..." 
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      {(sequence.type === 'visit_profile' || sequence.type === 'follow_member' || sequence.type === 'like_post') && (
        <div className="bg-accent/50 border border-accent rounded-md p-4">
          <p className="text-sm text-muted-foreground">
            This action will be performed automatically when the campaign runs.
          </p>
        </div>
      )}
    </div>
  );
}

interface RecipientsSectionProps {
  recipientSource: string;
  setRecipientSource: (value: string) => void;
  selectedList: string;
  setSelectedList: (value: string) => void;
  excludeInNetwork: boolean;
  setExcludeInNetwork: (value: boolean) => void;
}

function RecipientsSection({
  recipientSource,
  setRecipientSource,
  selectedList,
  setSelectedList,
  excludeInNetwork,
  setExcludeInNetwork,
}: RecipientsSectionProps) {
  return (
    <>
      <h2 className="text-lg font-medium mb-4">Recipients</h2>

      <div className="space-y-6">
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
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
