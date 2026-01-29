import { FilterTab } from '@/types/contact';

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  counts: Record<FilterTab, number>;
}

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sent-by-member', label: 'Last message sent by member' },
  { id: 'sent-by-me', label: 'Last message sent by me' },
];

export function FilterTabs({ activeTab, onTabChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-medium transition-colors relative
            ${activeTab === tab.id 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {tab.label}
          {counts[tab.id] > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({counts[tab.id]})
            </span>
          )}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
