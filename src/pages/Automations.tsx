
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AutomationCard from "@/components/AutomationCard";

// Sample automation data
const sampleAutomations = [
  {
    id: "1",
    name: "New Customer Follow-up",
    description: "Sends a welcome email when a new customer signs up",
    platform: "Gmail" as const,
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
    status: "failed" as const,
    last_run: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    runs_today: 12,
    failed_runs: 3
  }
];

const Automations = () => {
  const [automations, setAutomations] = useState(sampleAutomations);
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const handleConnect = () => {
    setShowConnectDialog(true);
    toast("Coming Soon", {
      description: "Connecting new automations will be available in the next update."
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Automations</h1>
            <Button className="flex items-center gap-2" onClick={handleConnect}>
              <Plus className="h-4 w-4" />
              Connect Automation
            </Button>
          </div>
          
          {automations.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground">No automations connected yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect your first automation to start managing it
                  </p>
                  <Button className="mt-4 flex items-center gap-2" onClick={handleConnect}>
                    <Plus className="h-4 w-4" />
                    Connect Automation
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
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Automations;
