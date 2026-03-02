import { ChevronDown, Coins, FolderOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-3">
        {/* Credits */}
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <Coins className="w-4 h-4 text-metric-green" />
          <span className="font-medium">0 Credits</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Workspace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <FolderOpen className="w-4 h-4" />
              <span className="font-medium">Capital One</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Capital One</DropdownMenuItem>
            <DropdownMenuItem>Workspace 2</DropdownMenuItem>
            <DropdownMenuItem>Create Workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
