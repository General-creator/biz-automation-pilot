
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AutomationCard, { Automation } from "@/components/AutomationCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample workflow data
const sampleWorkflows = [
  {
    id: "1",
    name: "New Customer Follow-up",
    description: "Sends a welcome email when a new customer signs up",
    platform: "Gmail" as const,
    connectedPlatforms: ["HubSpot", "Zapier"] as Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">,
    status: "active" as const,
    last_run: new Date().toISOString(),
    next_run: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    runs_today: 3,
    failed_runs: 0
  },
  {
    id: "2",
    name: "Lead Qualification",
    description: "Scores and categorizes new leads based on criteria",
    platform: "HubSpot" as const,
    connectedPlatforms: ["Zapier", "Airtable"] as Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">,
    status: "paused" as const,
    last_run: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    runs_today: 0,
    failed_runs: 0
  },
  {
    id: "3",
    name: "Payment Notification",
    description: "Sends notifications when payments are processed",
    platform: "Stripe" as const,
    connectedPlatforms: ["Gmail", "Make"] as Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">,
    status: "failed" as const,
    last_run: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    runs_today: 12,
    failed_runs: 3
  }
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState<Automation[]>(sampleWorkflows);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<{
    name: string;
    description: string;
    platform: Automation["platform"] | "";
  }>({
    name: "",
    description: "",
    platform: "",
  });

  const handleConnect = () => {
    setShowConnectDialog(true);
  };

  const handleCloseDialog = () => {
    setShowConnectDialog(false);
    setNewWorkflow({
      name: "",
      description: "",
      platform: "",
    });
  };

  const handleAddWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description || !newWorkflow.platform) {
      toast("Please fill all fields", {
        description: "All fields are required to connect a new workflow."
      });
      return;
    }

    const newId = (workflows.length + 1).toString();
    
    const addedWorkflow: Automation = {
      id: newId,
      name: newWorkflow.name,
      description: newWorkflow.description,
      platform: newWorkflow.platform,
      connectedPlatforms: [],
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 86400000).toISOString(),
      runs_today: 0,
      failed_runs: 0
    };
    
    setWorkflows([...workflows, addedWorkflow]);
    handleCloseDialog();
    
    toast("Workflow Connected", {
      description: `${newWorkflow.name} has been successfully connected.`
    });
  };

  const handleUpdateWorkflow = (updatedWorkflow: Automation) => {
    const updatedWorkflows = workflows.map(workflow => 
      workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow
    );
    
    setWorkflows(updatedWorkflows);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-[#E8F0EF] to-[#FAECE9] py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-orbit bg-clip-text text-transparent">Workflows</h1>
              <p className="text-slate-600 mt-2">Connect and manage your business workflows</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-orbit hover:opacity-90 shadow-md"
              onClick={handleConnect}
            >
              <Plus className="h-4 w-4" />
              Connect Workflow
            </Button>
          </div>
          
          {workflows.length === 0 ? (
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-[#4D7C79]">Your Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="text-slate-600 text-lg">No workflows connected yet</p>
                  <p className="text-slate-500 mt-2">
                    Connect your first workflow to start managing it
                  </p>
                  <Button 
                    className="mt-6 flex items-center gap-2 bg-gradient-orbit hover:opacity-90 shadow-md"
                    onClick={handleConnect}
                  >
                    <Plus className="h-4 w-4" />
                    Connect Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <AutomationCard 
                  key={workflow.id} 
                  automation={workflow}
                  onUpdate={handleUpdateWorkflow}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Connect Workflow Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="card-glass">
          <DialogHeader>
            <DialogTitle className="text-[#4D7C79]">Connect Workflow</DialogTitle>
            <DialogDescription className="text-slate-600">
              Connect an existing workflow from your integrated platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700">Workflow Name</Label>
              <Input 
                id="name" 
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                placeholder="Enter workflow name"
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700">Description</Label>
              <Input 
                id="description" 
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                placeholder="Describe what this workflow does"
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform" className="text-slate-700">Platform</Label>
              <Select 
                onValueChange={(value) => setNewWorkflow({...newWorkflow, platform: value as Automation["platform"]})}
              >
                <SelectTrigger id="platform" className="border-slate-300 focus:ring-[#4D7C79]">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200">
                  <SelectItem value="Zapier">Zapier</SelectItem>
                  <SelectItem value="Make">Make</SelectItem>
                  <SelectItem value="HubSpot">HubSpot</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Airtable">Airtable</SelectItem>
                  <SelectItem value="Gmail">Gmail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} className="border-[#4D7C79] text-[#4D7C79] hover:bg-[#4D7C79]/10">Cancel</Button>
            <Button 
              onClick={handleAddWorkflow}
              className="bg-gradient-orbit hover:opacity-90"
            >
              Connect Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workflows;
