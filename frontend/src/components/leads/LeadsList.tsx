"use client";

import { useState, useEffect } from 'react';
import { LeadList } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, Plus, MoreVertical, Linkedin, Users, RefreshCw } from 'lucide-react';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';
import { useToast } from '@/hooks/use-toast';

export function LeadsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('active');
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    pendingRequests: 0,
    recentConnections: 0,
    dailyQuotaLinkedIn: { used: 0, total: 100 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    toast({
      title: 'Loading Leads',
      description: 'Fetching your LinkedIn leads... This may take 2-3 minutes.',
    });

    try {
      const response = await LinkedInAgentAPI.getLeads();

      if (response.success && response.data) {
        setLeads(response.data.all || []);
        setStats(response.data.stats || {
          totalLeads: 0,
          pendingRequests: 0,
          recentConnections: 0,
          dailyQuotaLinkedIn: { used: 0, total: 100 }
        });

        toast({
          title: 'Leads Loaded',
          description: `Loaded ${response.data.all?.length || 0} leads from LinkedIn.`,
        });
      } else {
        toast({
          title: 'Failed to Load',
          description: response.error || 'Could not fetch leads',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads from LinkedIn.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group leads by status for display
  const lists: LeadList[] = [
    {
      id: 'pending',
      name: 'Pending Connection Requests',
      source: 'linkedin',
      memberCount: stats.pendingRequests,
      totalCapacity: 1000,
      importedAt: new Date().toLocaleDateString(),
      status: stats.pendingRequests > 0 ? 'sending' : 'not_started',
    },
    {
      id: 'recent',
      name: 'Recent Connections',
      source: 'linkedin',
      memberCount: stats.recentConnections,
      totalCapacity: 1000,
      importedAt: new Date().toLocaleDateString(),
      status: stats.recentConnections > 0 ? 'sending' : 'not_started',
    },
  ];

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">Lists of Leads</h1>
        
        <Button className="bg-primary hover:bg-primary/90">
          New Import
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        <Select value={listFilter} onValueChange={setListFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active lists</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="all">All lists</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-8 px-6 py-3 border-b border-border bg-surface">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLeads}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
        <div className="text-sm">
          <span className="text-muted-foreground">Total leads: </span>
          <span className="font-medium">{stats.totalLeads}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Pending requests: </span>
          <span className="font-medium">{stats.pendingRequests}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Recent connections: </span>
          <span className="font-medium">{stats.recentConnections}</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-sm">
            <span className="text-muted-foreground">LinkedIn automation: </span>
            <span className="font-medium">{stats.dailyQuotaLinkedIn.used} / {stats.dailyQuotaLinkedIn.total}</span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center px-6 py-2 border-b border-border bg-surface text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Name</div>
        <div>Members</div>
        <div>Date</div>
        <div>Status</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {filteredLists.map((list) => (
          <LeadListRow key={list.id} list={list} />
        ))}

        {filteredLists.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No lists found
          </div>
        )}
      </div>
    </div>
  );
}

function LeadListRow({ list }: { list: LeadList }) {
  const isAllLeads = list.name === 'All leads';

  const getStatusBadge = () => {
    switch (list.status) {
      case 'sent':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">Sent</Badge>;
      case 'sending':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Sending</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">Paused</Badge>;
      case 'not_started':
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs">Not started</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center px-6 py-3 border-b border-border hover:bg-row-hover transition-colors">
      <div className="flex items-center gap-3">
        {isAllLeads ? (
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Linkedin className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <span className="text-sm font-medium">{list.name}</span>
      </div>
      <div className="text-sm">
        {list.memberCount > 0 ? (
          <span className="text-primary">{list.memberCount} / {list.totalCapacity}</span>
        ) : null}
      </div>
      <div className="text-sm text-muted-foreground truncate">
        {list.importedAt || '-'}
      </div>
      <div>
        {getStatusBadge()}
      </div>
      <div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
