"use client";

import { useState } from 'react';
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Send, Loader2 } from 'lucide-react';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MessageDialog({ contact, open, onOpenChange }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!contact || !message.trim()) return;

    setIsSending(true);
    toast({
      title: 'Sending Message',
      description: `Sending message to ${contact.name}... This may take 2-3 minutes.`,
    });

    try {
      // We need profileUrl - let's construct it or use stored data
      const profileUrl = contact.profileUrl || `https://www.linkedin.com/in/${contact.name.toLowerCase().replace(/\s+/g, '-')}/`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'message',
          params: {
            profileUrl,
            message: message.trim(),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Message Sent',
          description: `Message sent to ${contact.name} successfully!`,
        });
        setMessage('');
        onOpenChange(false);
      } else {
        toast({
          title: 'Failed to Send',
          description: data.message || data.error || 'Could not send message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to send message', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {contact.name}</DialogTitle>
          <DialogDescription>
            {contact.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              disabled={isSending}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters
            </p>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Note:</strong> The message will be sent via LinkedIn messaging.
            This process takes about 2-3 minutes as it uses browser automation.
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
