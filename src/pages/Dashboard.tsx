
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Automation } from "@/components/AutomationCard";
import { Integration } from "@/types/integration";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch automations
  const { data: automations = [], isLoading: isLoadingAutomations } = useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching agents:", error);
        return [];
      }
      
      return data as Automation[];
    },
    enabled: !!user
  });

  // Fetch workflows (using the same automation data but treating them as workflows for the UI)
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching workflows:", error);
        return [];
      }
      
      return data as Automation[];
    },
    enabled: !!user
  });

  // Fetch integrations
  const { data: integrations = [], isLoading: isLoadingIntegrations } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "connected");
      
      if (error) {
        console.error("Error fetching integrations:", error);
        return [];
      }
      
      return data.map(integration => ({
        id: integration.id,
        name: integration.name,
        type: integration.type,
        status: integration.status,
        isConnected: integration.status === "connected",
        automationCount: 0, // We'll calculate this below
        category: ""  // This will be set properly below
      })) as Integration[];
    },
    enabled: !!user
  });

  // Count active automations
  const activeAutomations = automations.filter(
    automation => automation.status === "active"
  ).length;

  // Count active workflows
  const activeWorkflows = workflows.filter(
    workflow => workflow.status === "active"
  ).length;

  // Count connected integrations
  const connectedIntegrationsCount = integrations.length;

  // Combine automations data with integrations to count automations by integration
  const enhancedIntegrations = integrations.map(integration => {
    const automationCount = automations.filter(
      automation => automation.platform === integration.name
    ).length;
    
    return {
      ...integration,
      automationCount
    };
  });

  // Handle navigation to pages
  const handleViewAutomations = () => navigate("/automations");
  const handleViewIntegrations = () => navigate("/settings/integrations");
  const handleViewWorkflows = () => navigate("/workflows");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Agents</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAutomations ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-bold">{activeAutomations}</p>
                    <p className="text-sm text-muted-foreground">Running agents</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4" 
                      onClick={handleViewAutomations}
                    >
                      View All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWorkflows ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-bold">{activeWorkflows}</p>
                    <p className="text-sm text-muted-foreground">Running workflows</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4" 
                      onClick={handleViewWorkflows}
                    >
                      View All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingIntegrations ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-bold">{connectedIntegrationsCount}</p>
                    <p className="text-sm text-muted-foreground">Connected services</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4" 
                      onClick={handleViewIntegrations}
                    >
                      Manage
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {automations.length > 0 ? (
                  <div className="space-y-2">
                    {automations.slice(0, 3).map(automation => (
                      <div key={automation.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full mr-2 ${
                            automation.status === 'active' ? 'bg-green-500' : 
                            automation.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                          <span>{automation.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(automation.last_run).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={handleViewAutomations}
                    >
                      View All Activity
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
