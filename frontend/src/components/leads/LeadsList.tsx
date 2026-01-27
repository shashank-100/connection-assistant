"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LeadList, Lead } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreVertical, Linkedin, Users, RefreshCw, Trash2 } from 'lucide-react';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';
import { useToast } from '@/hooks/use-toast';
import { CSVUploadDialog } from './CSVUploadDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function LeadsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('active');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    pendingRequests: 0,
    recentConnections: 0,
    dailyQuotaLinkedIn: { used: 0, total: 100 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    toast({
      title: 'Loading Leads',
      description: 'Fetching your leads...',
    });

    try {
      const response = await fetch('https://courteous-empathy-production-9e68.up.railway.app/api/leads?userId=shashank', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const allLeads = Array.isArray(data.data) ? data.data : [];
        setLeads(allLeads);
        setStats({
          totalLeads: allLeads.length,
          pendingRequests: allLeads.filter((l: Lead) => l.status === 'pending').length,
          recentConnections: allLeads.filter((l: Lead) => l.status === 'connected').length,
          dailyQuotaLinkedIn: { used: 0, total: 100 }
        });

        toast({
          title: 'Leads Loaded',
          description: `Loaded ${allLeads.length} leads from database.`,
        });
      } else {
        toast({
          title: 'Failed to Load',
          description: data.error || 'Could not fetch leads',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads from database.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const lists: LeadList[] = useMemo(() => {
    return leads.reduce((acc: LeadList[], lead: Lead) => {
      const source = lead.source || 'default';
      const sourceName = lead.sourceName || source;
      const existingList = acc.find(l => l.id === source);
      
      if (existingList) {
        existingList.memberCount++;
      } else {
        acc.push({
          id: source,
          name: source === 'voyager_sync' ? 'LinkedIn Connections' : 
                source === 'connection_request' ? 'Sent Requests' : 
                source.startsWith('csv_') ? sourceName : source,
          memberCount: 1,
          totalCapacity: 1000,
          status: 'active' as const,
          importedAt: new Date(lead.created_at || lead.sentAt || Date.now()).toLocaleDateString()
        });
      }
      return acc;
    }, []);
  }, [leads]);

  const handleDeleteList = async (id: string, name: string) => {
    try {
      const response = await LinkedInAgentAPI.deleteLeadsBySource(id);
      if (response.success) {
        toast({
          title: 'List deleted',
          description: `The ${name} list has been removed.`,
        });
        fetchLeads();
      } else {
        toast({
          title: 'Delete failed',
          description: response.error || 'Could not delete the list.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to delete leads list', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the leads list.',
        variant: 'destructive',
      });
    }
  };

  const filteredLists = useMemo(() => {
    return lists.filter((list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lists, searchQuery]);

  const selectedListLeads = useMemo(() => {
    return leads.filter(lead => 
      selectedListId ? (lead.source || 'default') === selectedListId : false
    );
  }, [leads, selectedListId]);

  if (selectedListId) {
    const listName = lists.find(l => l.id === selectedListId)?.name || 'Leads';
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSelectedListId(null)}>
            ← Back to Lists
          </Button>
          <h1 className="text-lg font-semibold">{listName}</h1>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedListLeads.map((lead, i) => (
              <div key={i} className="p-4 border rounded-lg bg-surface flex items-center gap-3">
                {lead.profilePicture ? (
                  <img src={lead.profilePicture} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{lead.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">Lists of Leads</h1>

        <CSVUploadDialog onUploadSuccess={fetchLeads} />

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

      </div>

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
      </div>

      <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center px-6 py-2 border-b border-border bg-surface text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Name</div>
        <div>Members</div>
        <div>Date</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredLists.map((list) => (
          <div key={list.id} onClick={() => setSelectedListId(list.id)} className="cursor-pointer">
            <LeadListRow list={list} onDelete={() => handleDeleteList(list.id, list.name)} />
          </div>
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

function LeadListRow({ list, onDelete }: { list: LeadList; onDelete: () => void }) {
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
        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
          <Linkedin className="w-4 h-4 text-muted-foreground" />
        </div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive gap-2" onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>
              <Trash2 className="w-4 h-4" />
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}