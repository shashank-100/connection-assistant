import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, Filter, Inbox as InboxIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inbox = () => {
  return (
    <DashboardLayout title="Inbox">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="replied">Replied</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages..." 
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <TabsContent value="all">
          <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <InboxIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your inbox is empty
              </h3>
              <p className="text-muted-foreground">
                Messages from your campaigns will appear here. Start a campaign to begin conversations.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No unread messages</p>
          </div>
        </TabsContent>

        <TabsContent value="replied">
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No replied messages</p>
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No archived messages</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Inbox;
