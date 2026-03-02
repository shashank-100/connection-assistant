import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityChartProps {
  data?: Array<{
    date: string;
    connections: number;
    messages: number;
    replies: number;
  }>;
}

const defaultData = [
  { date: "28 Jan", connections: 0, messages: 0, replies: 0 },
  { date: "29 Jan", connections: 0, messages: 0, replies: 0 },
  { date: "30 Jan", connections: 0, messages: 0, replies: 0 },
  { date: "31 Jan", connections: 0, messages: 0, replies: 0 },
  { date: "01 Feb", connections: 0, messages: 0, replies: 0 },
  { date: "02 Feb", connections: 0, messages: 0, replies: 0 },
];

export function ActivityChart({ data = defaultData }: ActivityChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-metric-green rounded" />
            <span className="text-sm text-muted-foreground">Connections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-metric-orange rounded" />
            <span className="text-sm text-muted-foreground">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-metric-purple rounded" />
            <span className="text-sm text-muted-foreground">Replies</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--chart-grid))" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line 
              type="monotone" 
              dataKey="connections" 
              stroke="hsl(var(--metric-green))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="messages" 
              stroke="hsl(var(--metric-orange))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="replies" 
              stroke="hsl(var(--metric-purple))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
