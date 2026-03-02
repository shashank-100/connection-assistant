import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Linkedin, 
  Users, 
  Rocket, 
  MessageSquare, 
  Workflow,
  Bell,
  Settings,
  Hand
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Linkedin, label: "LinkedIn Accounts", path: "/accounts" },
  { icon: Users, label: "Leads", path: "/leads" },
  { icon: Rocket, label: "Campaigns", path: "/campaigns" },
  { icon: MessageSquare, label: "Inbox", path: "/inbox" },
  { icon: Workflow, label: "Workflows", path: "/workflows" },
];

const bottomNavItems = [
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={item.path}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-sidebar flex flex-col items-center py-4">
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 mb-6">
        <Hand className="w-7 h-7 text-sidebar-primary-foreground" />
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {mainNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <nav className="flex flex-col items-center gap-2 mt-auto">
        {bottomNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
    </aside>
  );
}
