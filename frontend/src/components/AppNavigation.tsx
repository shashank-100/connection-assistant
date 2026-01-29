"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Megaphone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Inbox', icon: Inbox },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/leads', label: 'Leads', icon: Users },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 px-4 py-2 border-b border-border bg-background">
      {navItems.map((item) => {
        const isActive = pathname === item.to;
        return (
          <Link
            key={item.to}
            href={item.to}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}