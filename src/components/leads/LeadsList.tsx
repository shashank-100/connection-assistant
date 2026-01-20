import { useState } from 'react';
import { LeadList } from '@/types/lead';
import { mockLeadLists, mockLeadStats } from '@/data/mockLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, Plus, MoreVertical, Linkedin, Users } from 'lucide-react';

export function LeadsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('active');
  const stats = mockLeadStats;
  const lists = mockLeadLists;

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

        <div className="ml-auto">
          <span className="text-sm text-primary cursor-pointer hover:underline">
            Upgrade to boost your leads import limits!
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-8 px-6 py-3 border-b border-border bg-surface">
        <div className="text-sm">
          <span className="text-muted-foreground">Total imported lists: </span>
          <span className="font-medium">{stats.totalImportedLists}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Total imported leads: </span>
          <span className="font-medium">{stats.totalImportedLeads}</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-sm bg-accent/50 px-3 py-1 rounded">
            <span className="text-muted-foreground">Monthly imports: </span>
            <span className="font-medium">{stats.monthlyImports.used} / {stats.monthlyImports.total}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Email credits: </span>
            <span className="font-medium">{stats.emailCredits}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Daily quotas - LinkedIn: </span>
            <span className="font-medium">{stats.dailyQuotaLinkedIn.used} / {stats.dailyQuotaLinkedIn.total}</span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_140px_120px_100px_40px] gap-4 items-center px-6 py-2 border-b border-border bg-surface text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Name</div>
        <div>Members</div>
        <div>Date</div>
        <div>Enriched emails</div>
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

  return (
    <div className="grid grid-cols-[1fr_100px_140px_120px_100px_40px] gap-4 items-center px-6 py-3 border-b border-border hover:bg-row-hover transition-colors">
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
      <div className="text-sm text-muted-foreground">
        {list.enrichedEmails || '-'}
      </div>
      <div>
        {list.status === 'paused' && (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
            Paused (Quota)
          </Badge>
        )}
      </div>
      <div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
