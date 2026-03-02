import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Workflow as WorkflowIcon } from "lucide-react";

const Workflows = () => {
  return (
    <DashboardLayout title="Workflows">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Automate your outreach with powerful workflow sequences
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border p-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <WorkflowIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No workflows created yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create automated workflows to streamline your LinkedIn outreach and follow-up sequences.
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Workflow
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Workflows;
