import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Upload, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLeads, useLeadLists, useDeleteLeadsBySource } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leads = () => {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: leadLists = [], isLoading: listsLoading } = useLeadLists();
  const deleteBySource = useDeleteLeadsBySource();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-gray-500",
      sent: "bg-blue-500",
      connected: "bg-green-500",
      replied: "bg-purple-500",
      not_interested: "bg-red-500",
    };
    return (
      <Badge className={`${variants[status] || "bg-gray-500"} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout title="Leads">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 w-64 bg-card"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <TabsContent value="all">
          {leadsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No leads yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Import leads from a CSV file or add them manually to get started with your outreach campaigns.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import CSV
                  </Button>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Lead
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={lead.profilePicture} />
                          <AvatarFallback>{lead.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{lead.name}</span>
                      </TableCell>
                      <TableCell>{lead.title}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lists">
          {listsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : leadLists.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground">No lead lists found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {leadLists.map((list: any) => (
                <Card key={list.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{list.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {list.memberCount} leads
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => deleteBySource.mutate(list.id)}
                      disabled={deleteBySource.isPending}
                    >
                      {deleteBySource.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Leads;
