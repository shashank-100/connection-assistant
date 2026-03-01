import { useState } from 'react';
import { Template, LeadVariable } from '@/types/template';
import { mockTemplates } from '@/data/mockTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, RotateCcw, Trash2 } from 'lucide-react';

export function TemplateEditor() {
  const [template, setTemplate] = useState<Template>(mockTemplates[0]);
  const [hasChanges, setHasChanges] = useState(false);

  const updateContent = (content: string) => {
    setTemplate({ ...template, content });
    setHasChanges(true);
  };

  const toggleVariable = (variableId: string) => {
    const updatedVariables = template.variables.map((v) =>
      v.id === variableId ? { ...v, enabled: !v.enabled } : v
    );
    setTemplate({ ...template, variables: updatedVariables });
    setHasChanges(true);
  };

  const updateFallback = (variableId: string, fallback: string) => {
    const updatedVariables = template.variables.map((v) =>
      v.id === variableId ? { ...v, fallback } : v
    );
    setTemplate({ ...template, variables: updatedVariables });
    setHasChanges(true);
  };

  const discardChanges = () => {
    setTemplate(mockTemplates[0]);
    setHasChanges(false);
  };

  const saveTemplate = () => {
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <Select value={template.type} onValueChange={(value: 'prompt' | 'message') => setTemplate({ ...template, type: value })}>
            <SelectTrigger className="w-28 bg-primary/10 text-primary border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prompt">Prompt</SelectItem>
              <SelectItem value="message">Message</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-l border-border h-6" />

        <Input
          value={template.name}
          onChange={(e) => {
            setTemplate({ ...template, name: e.target.value });
            setHasChanges(true);
          }}
          className="w-48 border-none bg-transparent font-medium text-foreground px-0 focus-visible:ring-0"
        />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={discardChanges}
            disabled={!hasChanges}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Discard current changes
          </Button>
          <Button
            size="sm"
            onClick={saveTemplate}
            className="bg-primary hover:bg-primary/90"
          >
            Save
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Prompt Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Prompt</h2>
          
          <div className="flex items-center justify-between mb-4">
            <Select value={template.promptModel || ''} onValueChange={(value) => setTemplate({ ...template, promptModel: value })}>
              <SelectTrigger className="w-56 bg-primary/10 text-primary border-primary/20">
                <SelectValue placeholder="Choose A Prompt Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-amber-400 hover:bg-amber-500 text-amber-900">
              Messages preview
            </Button>
          </div>

          {/* Tip Box */}
          <div className="border-l-4 border-primary bg-primary/5 p-4 mb-4 rounded-r space-y-2">
            <p className="font-semibold text-sm">
              Tips to avoid spam detection:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Start your prompt with "You are..." to set the AI's role clearly.</li>
              <li>Instruct the AI to reference something specific about each lead (headline, company, recent work).</li>
              <li>Ask for varied sentence structure so each message feels unique, not templated.</li>
              <li>Avoid filler openers like "I hope this finds you well" or "I came across your profile".</li>
              <li>Keep messages under 90 words — shorter messages have higher reply rates and lower spam scores.</li>
              <li>Use the delay settings between campaign steps to mimic natural human pacing.</li>
            </ul>
          </div>

          {/* Prompt Textarea */}
          <Textarea
            value={template.content}
            onChange={(e) => updateContent(e.target.value)}
            className="min-h-[300px] font-mono text-sm resize-none"
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
            {template.variables.map((variable) => (
              <VariableRow
                key={variable.id}
                variable={variable}
                onToggle={() => toggleVariable(variable.id)}
                onFallbackChange={(fallback) => updateFallback(variable.id, fallback)}
              />
            ))}
          </div>
        </div>
      </div>
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
