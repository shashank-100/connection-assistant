import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  return (
    <DashboardLayout title="Notifications">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Stay updated with your campaign activities
        </p>
        <Button variant="outline" className="gap-2">
          <Check className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No notifications yet
          </h3>
          <p className="text-muted-foreground">
            You'll receive notifications about campaign activities, connection requests, and message replies here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
