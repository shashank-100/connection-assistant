import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Loader2, Play, Pause, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaigns, useStartCampaign, usePauseCampaign, useResumeCampaign } from "@/hooks/useCampaigns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Campaigns = () => {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const startCampaign = useStartCampaign();
  const pauseCampaign = usePauseCampaign();
  const resumeCampaign = useResumeCampaign();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      draft: { color: "bg-gray-500", label: "Draft" },
      active: { color: "bg-green-500", label: "Active" },
      paused: { color: "bg-yellow-500", label: "Paused" },
      completed: { color: "bg-blue-500", label: "Completed" },
    };
    const variant = variants[status] || variants.draft;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  const filterCampaigns = (status?: string) => {
    if (!status) return campaigns;
    return campaigns.filter((c: any) => c.status === status);
  };

  const renderCampaignCard = (campaign: any) => {
    const stats = campaign.stats || {};
    const total = stats.total || 0;
    const completed = (stats.sent || 0) + (stats.connected || 0);
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return (
      <Card key={campaign.id} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{campaign.name}</h3>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              Created {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {campaign.status === 'active' ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => pauseCampaign.mutate(campaign.id)}
                disabled={pauseCampaign.isPending}
              >
                {pauseCampaign.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
                Pause
              </Button>
            ) : campaign.status === 'paused' ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => resumeCampaign.mutate(campaign.id)}
                disabled={resumeCampaign.isPending}
              >
                {resumeCampaign.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Resume
              </Button>
            ) : campaign.status === 'draft' ? (
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => startCampaign.mutate(campaign.id)}
                disabled={startCampaign.isPending}
              >
                {startCampaign.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Start
              </Button>
            ) : null}
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {total > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completed} / {total} leads</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Pending</p>
                <p className="font-semibold">{stats.pending || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sent</p>
                <p className="font-semibold">{stats.sent || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Connected</p>
                <p className="font-semibold text-green-600">{stats.connected || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Replied</p>
                <p className="font-semibold text-blue-600">{stats.replied || 0}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderContent = (filteredCampaigns: any[]) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (filteredCampaigns.length === 0) {
      return (
        <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No campaigns found
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first campaign to start automating your LinkedIn outreach.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredCampaigns.map(renderCampaignCard)}
      </div>
    );
  };

  return (
    <DashboardLayout title="Campaigns">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-9 w-64 bg-card"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <TabsContent value="all">
          {renderContent(campaigns)}
        </TabsContent>

        <TabsContent value="active">
          {renderContent(filterCampaigns('active'))}
        </TabsContent>

        <TabsContent value="paused">
          {renderContent(filterCampaigns('paused'))}
        </TabsContent>

        <TabsContent value="completed">
          {renderContent(filterCampaigns('completed'))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Campaigns;
