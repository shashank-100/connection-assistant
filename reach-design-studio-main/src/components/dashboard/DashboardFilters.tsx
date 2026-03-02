import { ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  onSenderChange?: (value: string) => void;
  onCampaignChange?: (value: string) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DashboardFilters({ 
  onSenderChange, 
  onCampaignChange, 
  onDateRangeChange 
}: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 0, 28),
    to: new Date(2026, 1, 3),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "M/d/yyyy");
    return `${format(dateRange.from, "M/d/yyyy")} – ${format(dateRange.to, "M/d/yyyy")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Select Senders */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select senders:</label>
        <Select onValueChange={onSenderChange}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select senders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Senders</SelectItem>
            <SelectItem value="sender-1">John Doe</SelectItem>
            <SelectItem value="sender-2">Jane Smith</SelectItem>
            <SelectItem value="sender-3">Mike Johnson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Select Campaign */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Campaign:</label>
        <Select onValueChange={onCampaignChange}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select target campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="campaign-1">Outreach Q1 2026</SelectItem>
            <SelectItem value="campaign-2">Product Launch</SelectItem>
            <SelectItem value="campaign-3">Re-engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Enter a date range:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-card font-normal"
            >
              <span>{formatDateRange()}</span>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
