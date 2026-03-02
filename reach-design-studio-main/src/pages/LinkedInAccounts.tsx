import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLinkedInAccounts, useDeleteLinkedInAccount } from "@/hooks/useLinkedInAccounts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LinkedInAccounts = () => {
  const { data: accounts = [], isLoading } = useLinkedInAccounts();
  const deleteAccount = useDeleteLinkedInAccount();

  return (
    <DashboardLayout title="LinkedIn Accounts">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              className="pl-9 w-64 bg-card"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No LinkedIn accounts connected
            </h3>
            <p className="text-muted-foreground mb-4">
              Connect your first LinkedIn account to start sending connection requests and messages.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Connect LinkedIn Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account: any) => (
            <Card key={account.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                    {account.label?.charAt(0)?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{account.label}</h3>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => deleteAccount.mutate(account.id)}
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LinkedInAccounts;
