import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { FilterTabs } from './FilterTabs';
import { SearchBar } from './SearchBar';
import { ContactTable } from './ContactTable';
import { mockContacts } from '@/data/mockContacts';
import { FilterTab, Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';

export function OutreachDashboard() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
      all: mockContacts.length,
      unread: mockContacts.filter((c) => !c.isRead).length,
      'sent-by-member': mockContacts.filter((c) => !c.sentByMe).length,
      'sent-by-me': mockContacts.filter((c) => c.sentByMe).length,
      'never-answered': mockContacts.filter((c) => c.sentByMe && !c.hasReplied).length,
    };
  }, []);

  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
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
    const headers = ['Name', 'Title', 'Last Message', 'Connection Date', 'Pipeline', 'Labels', 'Notes', 'Reminder'];
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

    const csv = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">LinkedIn Outreach</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          CSV
        </Button>
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
