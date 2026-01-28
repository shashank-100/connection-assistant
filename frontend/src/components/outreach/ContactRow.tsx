import { Contact } from '@/types/contact';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactRowProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ContactRow({ contact, isSelected, onSelect }: ContactRowProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={`
        grid grid-cols-[32px_1fr] gap-4 items-center px-4 py-3 
        border-b border-border hover:bg-row-hover transition-colors cursor-pointer
        ${!contact.isRead ? 'bg-accent/30' : ''}
      `}
    >
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(contact.id)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
      
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          {contact.avatarUrl ? (
            <img 
              src={contact.avatarUrl} 
              alt={contact.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">{initials}</span>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium text-foreground truncate ${!contact.isRead ? 'font-semibold' : ''}`}>
              {contact.name}
            </span>
            <span className="text-sm text-link truncate">
              - {contact.title}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {contact.lastMessage}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {contact.lastMessageTime} - Connection since {contact.connectionDate}
          </p>
        </div>
      </div>
    </div>
  );
}
