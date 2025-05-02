
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: string;
  logo: string;
  isConnected: boolean;
  automationCount: number;
}

const INTEGRATION_TYPES = [
  { value: "workflow", label: "Workflow", icon: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg" },
  { value: "crm", label: "CRM", icon: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg" },
  { value: "email", label: "Email", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { value: "payment", label: "Payment", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { value: "data", label: "Data", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg" }
];

const IntegrationsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    apiKey: ""
  });

  // Fetch integrations from Supabase
  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("integrations")
        .select("id, name, type, status, created_at");
      
      if (error) {
        toast("Failed to load integrations", {
          description: error.message,
        });
        throw error;
      }

      // Get automation count for each integration
      const automationCounts = await Promise.all(
        data.map(async (integration) => {
          const { count, error } = await supabase
            .from("automations")
            .select("id", { count: "exact", head: true })
            .eq("platform", integration.name);
          
          return { integrationId: integration.id, count: count || 0 };
        })
      );

      // Map to our component's expected format
      return data.map(item => {
        const integrationType = INTEGRATION_TYPES.find(t => t.value === item.type) || INTEGRATION_TYPES[0];
        const automationCount = automationCounts.find(c => c.integrationId === item.id)?.count || 0;
        
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          logo: integrationType.icon,
          isConnected: item.status === "connected",
          automationCount
        };
      });
    },
    enabled: !!user
  });

  // Create new integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: { name: string; type: string; apiKey: string }) => {
      const { data, error } = await supabase
        .from("integrations")
        .insert({
          user_id: user!.id,
          name: integration.name,
          type: integration.type,
          api_key: integration.apiKey,
          status: "connected"
        })
        .select();
      
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
    onError: (error: any) => {
      toast("Failed to connect integration", {
        description: error.message,
      });
    }
  });

  const handleConnect = () => {
    setIsDialogOpen(true);
  };

  const handleSaveIntegration = () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast("Please fill in required fields", {
        description: "Integration name and type are required.",
      });
      return;
    }

    createIntegrationMutation.mutate(newIntegration);
  };

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, string> = {
      workflow: "bg-purple-100 text-purple-800",
      crm: "bg-blue-100 text-blue-800",
      email: "bg-orange-100 text-orange-800",
      payment: "bg-green-100 text-green-800",
      data: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          categories[category] || categories.workflow
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Available Integrations</CardTitle>
          <Button size="sm" onClick={handleConnect}>
            <Plus className="h-4 w-4 mr-1" /> Connect Integration
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : integrations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden flex items-center justify-center bg-muted">
                        <img
                          src={integration.logo}
                          alt={integration.name}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          {getCategoryBadge(integration.type)}
                          {integration.isConnected && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground">
                      {integration.automationCount} automation
                      {integration.automationCount !== 1 ? "s" : ""} connected
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <h3 className="text-lg font-medium mb-2">No integrations connected</h3>
              <p className="text-muted-foreground mb-4">Connect your first integration to get started with automations</p>
              <Button onClick={handleConnect}>
                <Plus className="h-4 w-4 mr-1" /> Connect Integration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect New Integration</DialogTitle>
            <DialogDescription>
              Add details to connect a new API integration to your automations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Integration Name</Label>
              <Input
                id="name"
                placeholder="E.g., Zapier, HubSpot, Gmail"
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Integration Type</Label>
              <Select 
                value={newIntegration.type} 
                onValueChange={(value) => setNewIntegration({...newIntegration, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key (Optional)</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={newIntegration.apiKey}
                onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                The API key will be securely stored and used for automated connections.
              </p>
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
              {createIntegrationMutation.isPending ? "Connecting..." : "Connect Integration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationsList;
