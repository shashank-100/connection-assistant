import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { StatsSection } from "@/components/dashboard/StatsSection";

const metrics = [
  { label: "Connections Sent", value: 0, color: "blue" as const },
  { label: "Connections Accepted", value: 0, color: "green" as const, percentage: 0.0, showPercentage: true },
  { label: "Messages Sent", value: 0, color: "orange" as const },
  { label: "Message Replies", value: 0, color: "purple" as const, percentage: 0.0, showPercentage: true },
  { label: "InMails Sent", value: 0, color: "cyan" as const },
  { label: "InMail Replies", value: 0, color: "pink" as const, percentage: 0.0, showPercentage: true },
];

const Index = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Filters */}
      <DashboardFilters />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color={metric.color}
            percentage={metric.percentage}
            showPercentage={metric.showPercentage}
          />
        ))}
      </div>

      {/* Activity Chart */}
      <div className="mb-8">
        <ActivityChart />
      </div>

      {/* Stats Sections */}
      <StatsSection />
    </DashboardLayout>
  );
};

export default Index;
