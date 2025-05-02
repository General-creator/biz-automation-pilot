
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    platform: "Zapier" as Automation["platform"]
  });
  const queryClient = useQueryClient();

  // Fetch automations from Supabase
  const { data: automations = [], isLoading: isLoadingAutomations } = useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast("Failed to load automations", {
          description: error.message,
        });
        throw error;
      }
      
      return data as Automation[];
    },
    enabled: !!user,
  });

  // Fetch activities from Supabase
  const { data: activities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
      
      if (error) {
        toast("Failed to load activities", {
          description: error.message,
        });
        throw error;
      }
      
      return data.map(activity => ({
        id: activity.id,
        automationName: activity.automation_name,
        platform: activity.platform,
        status: activity.status as "success" | "failure",
        timestamp: new Date(activity.timestamp).toLocaleString(),
        message: activity.message || ""
      })) as ActivityItem[];
    },
    enabled: !!user,
  });

  // Create new automation mutation
  const createAutomationMutation = useMutation({
    mutationFn: async (automation: {
      name: string;
      description: string;
      platform: string;
    }) => {
      const { data, error } = await supabase.from("automations").insert({
        user_id: user!.id,
        name: automation.name,
        description: automation.description,
        platform: automation.platform,
        status: "active",
        last_run: new Date().toISOString(),
        next_run: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        runs_today: 0,
        failed_runs: 0
      }).select();

      if (error) {
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      setIsDialogOpen(false);
      setNewAutomation({
        name: "",
        description: "",
        platform: "Zapier"
      });
      toast("Automation created", {
        description: "Your new automation has been successfully created.",
      });
    },
    onError: (error) => {
      toast("Failed to create automation", {
        description: error.message,
      });
    }
  });

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

  // Updated integrations data to properly reflect connection status
  const [integrations] = useState([
    {
      id: "1",
      name: "Zapier",
      logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
      isConnected: false,
      automationCount: 0,
      category: "workflow",
      type: "workflow",
      status: "disconnected"
    },
    {
      id: "2",
      name: "Make (Integromat)",
      logo: "https://images.ctfassets.net/qqlj6g4ee76j/7HzRrlvRzl271CMotqRjPR/dd936ac36c125b5ca384e0316f7c8a31/Make-Symbol-Color.svg",
      isConnected: false,
      automationCount: 0,
      category: "workflow",
      type: "workflow",
      status: "disconnected"
    },
    {
      id: "3",
      name: "HubSpot",
      logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
      isConnected: false,
      automationCount: 0,
      category: "crm",
      type: "crm",
      status: "disconnected"
    },
    {
      id: "4",
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      isConnected: false,
      automationCount: 0,
      category: "payment",
      type: "payment",
      status: "disconnected"
    }
  ] as any);

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
      });
      return;
    }

    createAutomationMutation.mutate(newAutomation);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 bg-gradient-to-br from-[#4D7C79]/5 to-[#D94A38]/5">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gradient-orbit">Welcome to Orbit</h2>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your business automations in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          <div className="md:col-span-4">
            <Tabs defaultValue="automations" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList className="bg-white/50 backdrop-blur-sm">
                  <TabsTrigger value="automations" className="data-[state=active]:bg-white data-[state=active]:text-[#4D7C79]">Automations</TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:text-[#4D7C79]">Activity</TabsTrigger>
                  <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:text-[#4D7C79]">Integrations</TabsTrigger>
                </TabsList>
                <Button 
                  onClick={handleCreateAutomation} 
                  size="sm"
                  className="bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28]"
                >
                  <Plus className="h-4 w-4 mr-1" /> New Automation
                </Button>
              </div>
              <TabsContent value="automations" className="space-y-6">
                {isLoadingAutomations ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin h-8 w-8 border-4 border-[#4D7C79] border-t-transparent rounded-full"></div>
                  </div>
                ) : automations.length > 0 ? (
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
                {isLoadingActivities ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin h-8 w-8 border-4 border-[#4D7C79] border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ActivityLog activities={activities} />
                )}
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
        <DialogContent className="card-glass sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#4D7C79]">Create New Automation</DialogTitle>
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
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Briefly describe what this automation does"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
                className="border-slate-300 focus-visible:ring-[#4D7C79]"
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
                <SelectTrigger className="border-slate-300 focus:ring-[#4D7C79]">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200">
                  <SelectItem value="Zapier">Zapier</SelectItem>
                  <SelectItem value="Make">Make (Integromat)</SelectItem>
                  <SelectItem value="HubSpot">HubSpot</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAutomation}
              disabled={createAutomationMutation.isPending}
              className="bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28]"
            >
              {createAutomationMutation.isPending ? "Creating..." : "Create Automation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t bg-white/50 backdrop-blur-sm py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Orbit. All rights reserved.
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
