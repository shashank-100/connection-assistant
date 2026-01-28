import { useState } from 'react';
import { SequenceStep } from '@/types/campaign';
import { LeadVariable } from '@/types/template';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultSequences } from '@/data/mockCampaigns';
import { defaultVariables, defaultPromptContent } from '@/data/mockTemplates';
import { Check, AlertCircle, Play, Pause } from 'lucide-react';
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
  const [promptModel, setPromptModel] = useState<string>('');
  const [promptContent, setPromptContent] = useState(defaultPromptContent);
  const [variables, setVariables] = useState<LeadVariable[]>(defaultVariables);
  const [ignoreDelay, setIgnoreDelay] = useState('1');
  const [messageMode, setMessageMode] = useState<'message' | 'ai_prompt'>('ai_prompt');

  const toggleVariable = (variableId: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === variableId ? { ...v, enabled: !v.enabled } : v))
    );
  };

  const updateFallback = (variableId: string, fallback: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === variableId ? { ...v, fallback } : v))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{sequence.label}</h2>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs px-3 py-1.5 rounded-full flex items-center gap-1",
            sequence.enabled ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
          )}>
            {sequence.enabled && <Check className="w-3 h-3" />}
            {sequence.enabled ? "Sequence added" : "Disabled"}
          </span>
          <Button className="bg-amber-400 hover:bg-amber-500 text-amber-900">
            Messages preview
          </Button>
        </div>
      </div>

      {sequence.type === 'follow_up' && (
        <div className="flex items-center gap-3">
          <span className="text-sm">If the message is ignored for</span>
          <Select value={ignoreDelay} onValueChange={setIgnoreDelay}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day</SelectItem>
              <SelectItem value="2">2 days</SelectItem>
              <SelectItem value="3">3 days</SelectItem>
              <SelectItem value="5">5 days</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(sequence.type === 'send_message' || sequence.type === 'follow_up') && (
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              {sequence.order}
            </div>
            <span className="text-sm">
              Send a message to the members who have passed the previous step
            </span>
          </div>

          {/* Message/AI Prompt tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessageMode('message')}
              className={cn(
                "px-4 py-2 text-sm rounded-md transition-colors",
                messageMode === 'message' 
                  ? "bg-muted text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Message
            </button>
            <button
              onClick={() => setMessageMode('ai_prompt')}
              className={cn(
                "px-4 py-2 text-sm rounded-md transition-colors",
                messageMode === 'ai_prompt' 
                  ? "bg-muted text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              AI Prompt
            </button>
            <button className="text-sm text-primary hover:underline ml-2">
              + Use an AI prompt template
            </button>
          </div>

          {messageMode === 'ai_prompt' ? (
            <>
              {/* Prompt Section */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Prompt</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <Select value={promptModel} onValueChange={setPromptModel}>
                    <SelectTrigger className="w-56 bg-primary/10 text-primary border-primary/20">
                      <SelectValue placeholder="Choose A Prompt Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tip Box */}
                <div className="border-l-4 border-primary bg-primary/5 p-4 mb-4 rounded-r">
                  <p className="font-semibold text-sm mb-1">
                    For best results, define the AI's role with "You are..." instead of "I am...".
                  </p>
                  <p className="text-sm text-muted-foreground">
                    When you start a prompt with "You are an expert in...", you tell the AI which role to adopt and how to respond. If you write "I am an expert...", you're just describing yourself, not guiding the AI.
                  </p>
                </div>

                {/* Prompt Textarea */}
                <Textarea
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm resize-none"
                  placeholder="Enter your prompt here..."
                />
              </div>

              {/* Variables Section */}
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-1">Available lead context variables:</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select the variables you want to be passed to the AI for each lead.
                </p>

                <div className="space-y-4">
                  {variables.map((variable) => (
                    <VariableRow
                      key={variable.id}
                      variable={variable}
                      onToggle={() => toggleVariable(variable.id)}
                      onFallbackChange={(fallback) => updateFallback(variable.id, fallback)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <Textarea
                className="min-h-[200px] text-sm resize-none"
                placeholder="Write your message here... Use {{firstname}}, {{company}} etc. for personalization."
              />
            </div>
          )}
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

function VariableRow({
  variable,
  onToggle,
  onFallbackChange,
}: {
  variable: LeadVariable;
  onToggle: () => void;
  onFallbackChange: (fallback: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <Switch
        checked={variable.enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm font-medium w-36">{variable.name}</span>
      {variable.fallbackPlaceholder !== undefined && (
        <Input
          value={variable.fallback || ''}
          onChange={(e) => onFallbackChange(e.target.value)}
          placeholder={variable.fallbackPlaceholder}
          className="flex-1 text-sm"
          disabled={!variable.enabled}
        />
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
