'use client';

import { useState } from 'react';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, RefreshCw } from 'lucide-react';

export default function TestConnectPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const profileUrl = 'https://www.linkedin.com/in/tomer-kulla/';
  const userId = 'shashank';

  const handleTestConnect = async () => {
    setLoading(true);
    toast({
      title: 'Testing Frontend -> Railway',
      description: `Sending connect request to Tomer Kulla for user: ${userId}`,
    });

    try {
      const rawRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://courteous-empathy-production-9e68.up.railway.app'}/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'linkedin-connect',
          profileUrl,
          userId
        })
      });
      
      const data = await rawRes.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: `Connection request sent to Tomer Kulla via Railway.`,
        });
        console.log('Backend Response:', data);
      } else {
        toast({
          title: 'Failed',
          description: data.error || 'Check console for details',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="p-8 border rounded-lg shadow-sm bg-card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Frontend Integration Test</h1>
        <p className="text-muted-foreground mb-6">
          Testing connection request from <strong>Frontend</strong> to <strong>Railway Backend</strong>
        </p>
        
        <div className="space-y-4 mb-8 text-left text-sm bg-muted p-4 rounded">
          <div><strong>User:</strong> {userId}</div>
          <div><strong>Profile:</strong> Tomer Kulla</div>
          <div><strong>Backend:</strong> Railway</div>
        </div>

        <Button 
          onClick={handleTestConnect} 
          disabled={loading}
          className="w-full gap-2 h-12 text-lg"
        >
          {loading ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
          {loading ? 'Sending Request...' : 'Send Connect Request'}
        </Button>
      </div>
    </div>
  );
}
