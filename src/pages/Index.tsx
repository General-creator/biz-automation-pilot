
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import AutomationCard, { Automation } from "@/components/AutomationCard";
import ActivityLog, { ActivityItem } from "@/components/ActivityLog";
import NotificationPanel, { Notification } from "@/components/NotificationPanel";
import EmptyState from "@/components/EmptyState";
import IntegrationsList from "@/components/IntegrationsList";
import { CirclePlay, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    platform: "Zapier" as Automation["platform"]
  });

  // Sample data for activities
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      automationName: "New Lead Follow-up",
      platform: "Zapier",
      status: "success",
      timestamp: "Today, 2:30 PM",
      message: "Email sent to new lead: john.doe@example.com"
    },
    {
      id: "2",
      automationName: "Invoice Paid Notification",
      platform: "Stripe",
      status: "success",
      timestamp: "Yesterday, 5:45 PM",
      message: "Team notified about invoice #INV-2023-004"
    },
    {
      id: "3",
      automationName: "Weekly Report Generator",
      platform: "Airtable",
      status: "failure",
      timestamp: "Today, 9:00 AM",
      message: "Failed to access Airtable API: Authentication error"
    },
    {
      id: "4",
      automationName: "Customer Onboarding Sequence",
      platform: "HubSpot",
      status: "success",
      timestamp: "Today, 3:15 PM",
      message: "Onboarding email sent to 5 new customers"
    },
    {
      id: "5",
      automationName: "Support Ticket Alerts",
      platform: "Make",
      status: "success",
      timestamp: "Today, 4:20 PM",
      message: "Alert sent for ticket #T-2023-089: Critical issue"
    }
  ]);

  // Sample data for notifications
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      automationName: "Weekly Report Generator",
      message: "Failed to access Airtable API: Authentication error",
      timestamp: "Today, 9:00 AM",
      severity: "high"
    },
    {
      id: "2",
      automationName: "Customer Data Sync",
      message: "5 consecutive failures detected",
      timestamp: "Yesterday, 11:30 PM",
      severity: "medium"
    }
  ]);

  // Sample data for integrations
  const [integrations] = useState([
    {
      id: "1",
      name: "Zapier",
      logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
      isConnected: true,
      automationCount: 2,
      category: "workflow"
    },
    {
      id: "2",
      name: "Make (Integromat)",
      logo: "https://images.ctfassets.net/qqlj6g4ee76j/7HzRrlvRzl271CMotqRjPR/dd936ac36c125b5ca384e0316f7c8a31/Make-Symbol-Color.svg",
      isConnected: true,
      automationCount: 1,
      category: "workflow"
    },
    {
      id: "3",
      name: "HubSpot",
      logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
      isConnected: true,
      automationCount: 1,
      category: "crm"
    },
    {
      id: "4",
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      isConnected: true,
      automationCount: 1,
      category: "payment"
    },
    {
      id: "5",
      name: "Airtable",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
      isConnected: true,
      automationCount: 1,
      category: "data"
    },
    {
      id: "6",
      name: "Gmail",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      isConnected: false,
      automationCount: 0,
      category: "email"
    }
  ] as any);

  // Load automations from localStorage for this specific user
  useEffect(() => {
    if (user) {
      const storedAutomations = localStorage.getItem(`automations-${user.id}`);
      if (storedAutomations) {
        setAutomations(JSON.parse(storedAutomations));
      } else {
        // First login for this user, start with empty automations
        setAutomations([]);
      }
    }
  }, [user]);

  // Save automations to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`automations-${user.id}`, JSON.stringify(automations));
    }
  }, [automations, user]);

  const handleConnectIntegration = () => {
    toast("Connect a new integration", {
      description: "Select from our available integrations to automate your workflows.",
    });
  };

  const handleCreateAutomation = () => {
    setIsDialogOpen(true);
  };

  const handleSaveAutomation = () => {
    if (!newAutomation.name || !newAutomation.description) {
      toast("Please fill in all required fields", {
        description: "Automation name and description are required.",
        variant: "destructive",
      });
      return;
    }

    const newAutomationItem: Automation = {
      id: `automation-${Date.now()}`,
      name: newAutomation.name,
      description: newAutomation.description,
      platform: newAutomation.platform,
      status: "active",
      lastRun: "Just now",
      nextRun: "In 4 hours",
      runsToday: 0,
      failedRuns: 0
    };

    setAutomations([...automations, newAutomationItem]);
    setIsDialogOpen(false);
    setNewAutomation({
      name: "",
      description: "",
      platform: "Zapier"
    });

    toast("Automation created", {
      description: "Your new automation has been successfully created.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to AutoPilot</h2>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your business automations in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          <div className="md:col-span-4">
            <Tabs defaultValue="automations" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="automations">Automations</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                <Button onClick={handleCreateAutomation} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> New Automation
                </Button>
              </div>
              <TabsContent value="automations" className="space-y-6">
                {automations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {automations.map((automation) => (
                      <AutomationCard key={automation.id} automation={automation} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No automations yet"
                    description="Connect your first integration to start creating automations."
                    actionText="Create Automation"
                    onAction={handleCreateAutomation}
                    icon={<CirclePlay className="h-6 w-6" />}
                  />
                )}
              </TabsContent>
              <TabsContent value="activity">
                <ActivityLog activities={activities} />
              </TabsContent>
              <TabsContent value="integrations">
                <IntegrationsList integrations={integrations} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-2">
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Automation</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new automation workflow.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                placeholder="E.g., New Lead Follow-up"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Briefly describe what this automation does"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={newAutomation.platform} 
                onValueChange={(value) => setNewAutomation({
                  ...newAutomation, 
                  platform: value as Automation["platform"]
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zapier">Zapier</SelectItem>
                  <SelectItem value="Make">Make (Integromat)</SelectItem>
                  <SelectItem value="HubSpot">HubSpot</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Airtable">Airtable</SelectItem>
                  <SelectItem value="Gmail">Gmail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAutomation}>
              Create Automation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t bg-white py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 AutoPilot. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="inline-flex items-center mr-4">
              <span className="h-2 w-2 rounded-full bg-success mr-1"></span>
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
