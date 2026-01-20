import { Contact } from '@/types/contact';
import { ContactRow } from './ContactRow';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
}

export function ContactTable({ contacts, selectedIds, onSelect, onSelectAll }: ContactTableProps) {
  const allSelected = contacts.length > 0 && selectedIds.size === contacts.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < contacts.length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-[32px_1fr_120px_140px_120px_100px] gap-4 items-center px-4 py-2 border-b border-border bg-surface sticky top-0">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={allSelected}
            ref={(ref) => {
              if (ref) {
                (ref as HTMLButtonElement).dataset.state = someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked';
              }
            }}
            onCheckedChange={onSelectAll}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Members
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Labels
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Pipeline | Column
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Notes
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Reminder
        </div>
      </div>

      <div>
        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            isSelected={selectedIds.has(contact.id)}
            onSelect={onSelect}
          />
        ))}
        
        {contacts.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No contacts found
          </div>
        )}
      </div>
    </div>
  );
}
