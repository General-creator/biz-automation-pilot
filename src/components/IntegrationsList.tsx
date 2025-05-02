
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  logo?: string;
  isConnected: boolean;
  automationCount: number;
  category: string;
  type: string;
  status: string;
}

interface IntegrationsListProps {
  integrations?: any[];
}

const IntegrationsList = ({ integrations: propIntegrations }: IntegrationsListProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    apiKey: "",
  });
  const queryClient = useQueryClient();
  
  // Fetch integrations from Supabase if not provided as props
  const { data: fetchedIntegrations = [], isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      if (!user) return [];
      
      // Get integrations
      const { data: integrationsData, error: integrationsError } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id);
      
      if (integrationsError) {
        toast("Failed to load integrations", {
          description: integrationsError.message,
        });
        throw integrationsError;
      }
      
      // Get automation counts for each integration
      const { data: automationsData, error: automationsError } = await supabase
        .from("automations")
        .select("platform, id")
        .eq("user_id", user.id);
        
      if (automationsError) {
        toast("Failed to load automation counts", {
          description: automationsError.message,
        });
      }
      
      // Count automations by platform
      const automationCounts: Record<string, number> = {};
      automationsData?.forEach(automation => {
        automationCounts[automation.platform] = (automationCounts[automation.platform] || 0) + 1;
      });
      
      // Format the integration data
      return integrationsData.map(integration => ({
        id: integration.id,
        name: integration.name,
        logo: getIntegrationLogo(integration.name),
        isConnected: integration.status === "connected",
        automationCount: automationCounts[integration.name] || 0,
        category: getCategoryForIntegration(integration.name),
        type: integration.type,
        status: integration.status
      })) as Integration[];
    },
    enabled: !!user && !propIntegrations
  });

  // Use prop integrations if provided, otherwise use fetched integrations
  const integrations = propIntegrations || fetchedIntegrations;
  
  // Helper function to get logo URL based on integration name
  const getIntegrationLogo = (name: string) => {
    // This would ideally be replaced with actual logos
    const logoMap: Record<string, string> = {
      "Zapier": "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
      "Make": "https://images.ctfassets.net/qqlj6g4ee76j/7HzRrlvRzl271CMotqRzPR/dd936ac36c125b5ca384e0316f7c8a31/Make-Symbol-Color.svg",
      "HubSpot": "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
      "Stripe": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      "Airtable": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
      "Gmail": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    };
    
    return logoMap[name] || "https://placehold.co/100x100?text=" + name.charAt(0);
  };
  
  // Helper function to categorize integrations
  const getCategoryForIntegration = (name: string) => {
    const categoryMap: Record<string, string> = {
      "Zapier": "workflow",
      "Make": "workflow",
      "HubSpot": "crm",
      "Stripe": "payment",
      "Airtable": "data",
      "Gmail": "email",
    };
    
    return categoryMap[name] || "other";
  };

  // Create new integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: { name: string; type: string; apiKey: string }) => {
      const { data, error } = await supabase.from("integrations").insert({
        user_id: user!.id,
        name: integration.name,
        type: integration.type,
        api_key: integration.apiKey,
        status: "connected",
      }).select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      setIsDialogOpen(false);
      setNewIntegration({ name: "", type: "", apiKey: "" });
      toast("Integration connected", {
        description: "Your new integration has been successfully connected.",
      });
    },
    onError: (error) => {
      toast("Failed to connect integration", {
        description: error.message,
      });
    }
  });

  // Updated disconnect mutation
  const disconnectIntegrationMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from("integrations")
        .update({ status: "disconnected" })
        .eq("id", id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast(`${data.name} disconnected`, {
        description: "Integration has been disconnected successfully.",
      });
    },
    onError: (error) => {
      toast("Failed to disconnect", {
        description: error.message,
      });
    }
  });

  // Updated reconnect mutation
  const reconnectIntegrationMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from("integrations")
        .update({ status: "connected" })
        .eq("id", id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast(`${data.name} reconnected`, {
        description: "Integration has been reconnected successfully.",
      });
    },
    onError: (error) => {
      toast("Failed to reconnect", {
        description: error.message,
      });
    }
  });

  const handleSaveIntegration = () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast("Please fill in all required fields", {
        description: "Integration name and type are required.",
      });
      return;
    }

    createIntegrationMutation.mutate(newIntegration);
  };

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  // Updated disconnect handler to use the mutation
  const handleDisconnect = (id: string) => {
    disconnectIntegrationMutation.mutate({ id });
  };

  // Updated reconnect handler to use the mutation
  const handleReconnect = (id: string) => {
    reconnectIntegrationMutation.mutate({ id });
  };
  
  if (isLoading && !propIntegrations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  // Group integrations by category
  const groupedIntegrations: Record<string, Integration[]> = {};
  integrations.forEach(integration => {
    const category = integration.category;
    if (!groupedIntegrations[category]) {
      groupedIntegrations[category] = [];
    }
    groupedIntegrations[category].push(integration);
  });

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Integrations</CardTitle>
          <Button size="sm" onClick={handleConnectClick}>Connect New</Button>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedIntegrations).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">No integrations connected yet</p>
              <Button variant="outline" className="mt-4" onClick={handleConnectClick}>
                Connect Your First Integration
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedIntegrations).map(([category, items]) => (
                <div key={category}>
                  <h3 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <div className="space-y-2">
                    {items.map((integration) => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          {integration.logo ? (
                            <div className="w-8 h-8 overflow-hidden">
                              <img 
                                src={integration.logo} 
                                alt={integration.name} 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md">
                              <span>{integration.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={integration.isConnected ? "outline" : "secondary"}
                                className={`text-xs ${integration.isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100'}`}
                              >
                                {integration.isConnected ? "Connected" : "Disconnected"}
                              </Badge>
                              {integration.automationCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {integration.automationCount} automation{integration.automationCount !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => 
                            integration.isConnected 
                              ? handleDisconnect(integration.id) 
                              : handleReconnect(integration.id)
                          }
                          disabled={disconnectIntegrationMutation.isPending || reconnectIntegrationMutation.isPending}
                        >
                          {integration.isConnected ? "Disconnect" : "Reconnect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect New Integration</DialogTitle>
            <DialogDescription>
              Enter the details for the integration you want to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="integration-type">Integration Type</Label>
              <Select 
                value={newIntegration.type} 
                onValueChange={(value) => setNewIntegration({...newIntegration, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow Automation</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="payment">Payment Processing</SelectItem>
                  <SelectItem value="data">Data Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="integration-name">Integration Name</Label>
              <Select 
                value={newIntegration.name} 
                onValueChange={(value) => setNewIntegration({...newIntegration, name: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
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
            
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={newIntegration.apiKey}
                onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveIntegration}
              disabled={createIntegrationMutation.isPending}
            >
              {createIntegrationMutation.isPending ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationsList;
