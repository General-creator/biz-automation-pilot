
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

// Sample automation data
const sampleAutomations = [
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

const Agents = () => {
  const [automations, setAutomations] = useState<Automation[]>(sampleAutomations);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [newAutomation, setNewAutomation] = useState<{
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
    setNewAutomation({
      name: "",
      description: "",
      platform: "",
    });
  };

  const handleAddAutomation = () => {
    if (!newAutomation.name || !newAutomation.description || !newAutomation.platform) {
      toast("Please fill all fields", {
        description: "All fields are required to connect a new agent."
      });
      return;
    }

    const newId = (automations.length + 1).toString();
    
    const addedAutomation: Automation = {
      id: newId,
      name: newAutomation.name,
      description: newAutomation.description,
      platform: newAutomation.platform,
      connectedPlatforms: [],
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 86400000).toISOString(),
      runs_today: 0,
      failed_runs: 0
    };
    
    setAutomations([...automations, addedAutomation]);
    handleCloseDialog();
    
    toast("Agent Connected", {
      description: `${newAutomation.name} has been successfully connected.`
    });
  };

  const handleUpdateAutomation = (updatedAutomation: Automation) => {
    const updatedAutomations = automations.map(automation => 
      automation.id === updatedAutomation.id ? updatedAutomation : automation
    );
    
    setAutomations(updatedAutomations);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-[#4D7C79]/5 to-[#D94A38]/5 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-orbit">Agents</h1>
              <p className="text-slate-600 mt-2">Connect and manage your business agents</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28] shadow-md"
              onClick={handleConnect}
            >
              <Plus className="h-4 w-4" />
              Connect Agent
            </Button>
          </div>
          
          {automations.length === 0 ? (
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-[#4D7C79]">Your Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="text-slate-600 text-lg">No agents connected yet</p>
                  <p className="text-slate-500 mt-2">
                    Connect your first agent to start managing it
                  </p>
                  <Button 
                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28] shadow-md"
                    onClick={handleConnect}
                  >
                    <Plus className="h-4 w-4" />
                    Connect Agent
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {automations.map((automation) => (
                <AutomationCard 
                  key={automation.id} 
                  automation={automation}
                  onUpdate={handleUpdateAutomation}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Connect Agent Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-[425px] card-glass">
          <DialogHeader>
            <DialogTitle className="text-[#4D7C79]">Connect Agent</DialogTitle>
            <DialogDescription className="text-slate-600">
              Connect an existing agent from your integrated platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700">Agent Name</Label>
              <Input 
                id="name" 
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                placeholder="Enter agent name"
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700">Description</Label>
              <Input 
                id="description" 
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
                placeholder="Describe what this agent does"
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform" className="text-slate-700">Platform</Label>
              <Select 
                onValueChange={(value) => setNewAutomation({...newAutomation, platform: value as Automation["platform"]})}
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
            <Button variant="outline" onClick={handleCloseDialog} className="border-slate-300 text-slate-700 hover:bg-slate-100">Cancel</Button>
            <Button 
              onClick={handleAddAutomation}
              className="bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28]"
            >
              Connect Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agents;
