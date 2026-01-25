'use client';

import { useState, useMemo, useEffect } from 'react';
import { Download, Bot, RefreshCw } from 'lucide-react';
import { FilterTabs } from './FilterTabs';
import { SearchBar } from './SearchBar';
import { ContactTable } from './ContactTable';
import { FilterTab, Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';

export function OutreachDashboard() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentAnalytics, setAgentAnalytics] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAgentAnalytics();
    fetchConversations();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/agent?checkAuth=true');
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(data.data.isLoggedIn);
      }
    } catch (error) {
      console.error('Failed to check auth', error);
    }
  };

  const handleOpenLogin = async () => {
    toast({
      title: 'Opening LinkedIn',
      description: 'Please log in to LinkedIn in the browser window.',
    });
    try {
      await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'openLogin' }),
      });
      setTimeout(checkAuth, 10000);
    } catch (error) {
      console.error('Failed to open login', error);
    }
  };

  const fetchAgentAnalytics = async () => {
    try {
      const res = await fetch('/api/agent');
      const data = await res.json();
      if (data.success) {
        setAgentAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const fetchConversations = async () => {
    setIsLoadingContacts(true);
    toast({
      title: 'Loading Conversations',
      description: 'Fetching your LinkedIn conversations... This may take 2-3 minutes.',
    });

    try {
      const response = await LinkedInAgentAPI.getConversations();

      if (response.success && response.data) {
        // Transform LinkedIn conversations to Contact format
        const transformedContacts: Contact[] = response.data.map((conv: any, index: number) => ({
          id: conv.id || `contact_${index}`,
          name: conv.name || 'Unknown',
          title: conv.title || '',
          lastMessage: conv.sentByMe ? `You: ${conv.lastMessage}` : conv.lastMessage,
          lastMessageTime: formatTimeAgo(conv.lastMessageTime),
          connectionDate: formatDate(conv.lastActivityAt),
          sentByMe: conv.sentByMe || false,
          isRead: conv.isRead !== false,
          hasReplied: !conv.sentByMe || conv.unreadCount > 0,
          labels: [],
          pipeline: 'Initial Contact',
          notes: '',
          reminder: undefined,
        }));

        setContacts(transformedContacts);
        toast({
          title: 'Conversations Loaded',
          description: `Loaded ${transformedContacts.length} conversations from LinkedIn.`,
        });
      } else {
        toast({
          title: 'Failed to Load',
          description: response.error || 'Could not fetch conversations',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch conversations from LinkedIn.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRunAgent = async () => {
    setIsAgentRunning(true);
    toast({
      title: 'Agent Started',
      description: 'LinkedIn Connection Agent is searching for leads...',
    });

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          params: { searchTerm: searchQuery || 'software engineer' },
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Agent Complete',
          description: 'Finished LinkedIn outreach tasks.',
        });
        fetchAgentAnalytics();
      } else {
        toast({
          title: 'Agent Failed',
          description: data.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to communicate with agent backend.',
        variant: 'destructive',
      });
    } finally {
      setIsAgentRunning(false);
    }
  };

  const filterContact = (contact: Contact, tab: FilterTab): boolean => {
    switch (tab) {
      case 'all':
        return true;
      case 'unread':
        return !contact.isRead;
      case 'sent-by-member':
        return !contact.sentByMe;
      case 'sent-by-me':
        return contact.sentByMe;
      case 'never-answered':
        return contact.sentByMe && !contact.hasReplied;
      default:
        return true;
    }
  };

  const counts = useMemo(() => {
    return {
      all: contacts.length,
      unread: contacts.filter((c) => !c.isRead).length,
      'sent-by-member': contacts.filter((c) => !c.sentByMe).length,
      'sent-by-me': contacts.filter((c) => c.sentByMe).length,
      'never-answered': contacts.filter((c) => c.sentByMe && !c.hasReplied).length,
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesTab = filterContact(contact, activeTab);
      const matchesSearch = searchQuery
        ? contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Title',
      'Last Message',
      'Connection Date',
      'Pipeline',
      'Labels',
      'Notes',
      'Reminder',
    ];
    const rows = filteredContacts
      .filter((c) => selectedIds.size === 0 || selectedIds.has(c.id))
      .map((c) => [
        c.name,
        c.title,
        c.lastMessage,
        c.connectionDate,
        c.pipeline,
        c.labels.join('; '),
        c.notes,
        c.reminder || '',
      ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {isLoggedIn === false && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="p-8 bg-card border border-border rounded-lg shadow-xl text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">LinkedIn Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Your LinkedIn session has expired or is not active. Please log in to continue using
              the automation tools.
            </p>
            <Button onClick={handleOpenLogin} size="lg" className="w-full gap-2">
              <Bot className="h-5 w-5" />
              Open LinkedIn to Login
            </Button>
            <Button variant="ghost" onClick={checkAuth} className="mt-4 text-xs">
              Already logged in? Click to refresh
            </Button>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">LinkedIn Outreach</h1>
          {agentAnalytics && (
            <div className="flex gap-4 text-xs text-muted-foreground border-l pl-4 border-border">
              <span>Connections: {agentAnalytics.totalConnections || 0}</span>
              <span>Messages: {agentAnalytics.totalMessages || 0}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConversations}
            disabled={isLoadingContacts}
            className="gap-2"
          >
            {isLoadingContacts ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoadingContacts ? 'Loading...' : 'Refresh'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRunAgent}
            disabled={isAgentRunning}
            className="gap-2"
          >
            {isAgentRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            {isAgentRunning ? 'Agent Running...' : 'Run Agent'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </header>

      <div className="px-6">
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      </div>

      <div className="px-6 py-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ContactTable
        contacts={filteredContacts}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />

      {selectedIds.size > 0 && (
        <div className="px-6 py-3 border-t border-border bg-surface">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} contact{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  );
}
