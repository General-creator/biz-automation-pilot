
import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AutomationCard, { Automation } from "@/components/AutomationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

// Sample data - this would come from your API in a real application
const automations: Automation[] = [
  {
    id: "1",
    name: "New Lead Follow-up Sequence",
    description: "Automatically sends emails to new leads",
    platform: "Make",
    status: "active",
    lastRun: "Today, 2:30 PM",
    nextRun: "Today, 5:30 PM",
    runsToday: 12,
    failedRuns: 0
  },
  {
    id: "2",
    name: "Invoice Payment Processing",
    description: "Processes payments in Stripe when invoices are paid",
    platform: "Zapier",
    status: "active",
    lastRun: "Today, 1:15 PM",
    nextRun: "Today, 4:15 PM",
    runsToday: 8,
    failedRuns: 0
  },
  {
    id: "3",
    name: "Customer Feedback Collection",
    description: "Collects and processes customer feedback",
    platform: "HubSpot",
    status: "paused",
    lastRun: "Yesterday, 3:45 PM",
    nextRun: undefined,
    runsToday: 0,
    failedRuns: 0
  },
  {
    id: "4",
    name: "Inventory Update Notification",
    description: "Sends alerts when inventory levels change",
    platform: "Airtable",
    status: "failed",
    lastRun: "Today, 10:20 AM",
    nextRun: undefined,
    runsToday: 5,
    failedRuns: 3
  }
];

const Automations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter automations based on search query
  const filteredAutomations = automations.filter(
    (automation) =>
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Automations</h1>
            <p className="text-muted-foreground">
              Manage your automation workflows
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Input 
              placeholder="Search automations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
            />
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredAutomations.length > 0 ? (
                filteredAutomations.map((automation) => (
                  <AutomationCard key={automation.id} automation={automation} />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No automations found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Automations;
