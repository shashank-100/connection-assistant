import { Link } from "react-router-dom";

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsTableProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  items: StatItem[];
}

function StatsTable({ title, linkText, linkHref, items }: StatsTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border animate-fade-in">
      <div className="p-4 border-b border-border">
        {linkText && linkHref ? (
          <Link 
            to={linkHref} 
            className="text-primary hover:underline font-medium"
          >
            {title}
          </Link>
        ) : (
          <h3 className="text-muted-foreground font-medium">{title}</h3>
        )}
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No data available
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatsTable
        title="All-Time Stats: LinkedIn Sender"
        linkText="All-Time Stats: LinkedIn Sender"
        linkHref="/accounts"
        items={[]}
      />
      <StatsTable
        title="All-Time Stats: Campaigns"
        items={[]}
      />
    </div>
  );
}
