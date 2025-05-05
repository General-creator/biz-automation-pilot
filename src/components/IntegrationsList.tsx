
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IntegrationCategory from "./integrations/IntegrationCategory";
import EmptyIntegrationsState from "./integrations/EmptyIntegrationsState";
import { useIntegrations } from "@/hooks/useIntegrations";
import IntegrationConnectForm from "./integrations/IntegrationConnectForm";
import { useState } from "react";
import { toast } from "sonner";
import { Integration } from "@/types/integration";

interface IntegrationsListProps {
  integrations?: Integration[];
}

const IntegrationsList = ({ integrations: propIntegrations }: IntegrationsListProps) => {
  const [isConnectFormOpen, setIsConnectFormOpen] = useState(false);
  const [reconnectIntegration, setReconnectIntegration] = useState<Integration | null>(null);
  
  const {
    groupedIntegrations,
    isLoading,
    handleDisconnect,
    handleReconnect,
    isDisconnectLoading,
    isReconnectLoading,
  } = useIntegrations(propIntegrations);

  // Handle disconnect action - works for both settings page and homepage
  const handleDisconnectAction = (id: string) => {
    // Show a toast to inform the user
    toast("Disconnecting integration...");
    // Call the core disconnect function from useIntegrations
    handleDisconnect(id);
  };

  // Find an integration by ID - unified helper function
  const findIntegrationById = (id: string): Integration | null => {
    if (propIntegrations) {
      // For homepage, search in prop integrations
      return propIntegrations.find(int => int.id === id) || null;
    } else {
      // For settings page, search in grouped integrations
      return Object.values(groupedIntegrations)
        .flat()
        .find(int => int.id === id) || null;
    }
  };

  // Open the reconnect form with the selected integration
  const handleReconnectAction = (id: string) => {
    const integration = findIntegrationById(id);
    
    if (integration) {
      setReconnectIntegration(integration);
      setIsConnectFormOpen(true);
    } else {
      toast.error("Integration not found");
    }
  };
  
  const handleCloseForm = () => {
    setIsConnectFormOpen(false);
    setReconnectIntegration(null);
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

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Integrations</CardTitle>
          <Button size="sm" onClick={() => setIsConnectFormOpen(true)}>Connect New</Button>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedIntegrations).length === 0 ? (
            <EmptyIntegrationsState onConnectClick={() => setIsConnectFormOpen(true)} />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedIntegrations).map(([category, items]) => (
                <IntegrationCategory
                  key={category}
                  category={category === "workflow" ? "Workflow" : category === "agent" ? "Agent" : category}
                  integrations={items}
                  onDisconnect={handleDisconnectAction}
                  onReconnect={handleReconnectAction}
                  isLoading={isDisconnectLoading || isReconnectLoading}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <IntegrationConnectForm
        isOpen={isConnectFormOpen}
        onClose={handleCloseForm}
        reconnectIntegration={reconnectIntegration}
      />
    </>
  );
};

export default IntegrationsList;
