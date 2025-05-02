
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Integration } from "@/types/integration";
import { disconnectIntegration, reconnectIntegration } from "@/integrations/integration-service";

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

export const useIntegrations = (propIntegrations?: any[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    apiKey: "",
  });

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
    mutationFn: async (id: string) => {
      const result = await disconnectIntegration(id);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
    onError: (error) => {
      toast("Failed to disconnect", {
        description: error.message,
      });
    }
  });

  // Updated reconnect mutation
  const reconnectIntegrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await reconnectIntegration(id);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
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
    disconnectIntegrationMutation.mutate(id);
  };

  // Updated reconnect handler to use the mutation
  const handleReconnect = (id: string) => {
    reconnectIntegrationMutation.mutate(id);
  };

  // Group integrations by category
  const groupedIntegrations: Record<string, Integration[]> = {};
  integrations.forEach(integration => {
    const category = integration.category;
    if (!groupedIntegrations[category]) {
      groupedIntegrations[category] = [];
    }
    groupedIntegrations[category].push(integration);
  });

  return {
    integrations,
    groupedIntegrations,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    newIntegration,
    setNewIntegration,
    handleSaveIntegration,
    handleConnectClick,
    handleDisconnect,
    handleReconnect,
    isDisconnectLoading: disconnectIntegrationMutation.isPending,
    isReconnectLoading: reconnectIntegrationMutation.isPending,
    isConnectLoading: createIntegrationMutation.isPending,
  };
};
