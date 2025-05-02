
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IntegrationCategory from "./integrations/IntegrationCategory";
import EmptyIntegrationsState from "./integrations/EmptyIntegrationsState";
import { useIntegrations } from "@/hooks/useIntegrations";

interface IntegrationsListProps {
  integrations?: any[];
}

const IntegrationsList = ({ integrations: propIntegrations }: IntegrationsListProps) => {
  const {
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
    isDisconnectLoading,
    isReconnectLoading,
    isConnectLoading,
  } = useIntegrations(propIntegrations);
  
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
          <Button size="sm" onClick={handleConnectClick}>Connect New</Button>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedIntegrations).length === 0 ? (
            <EmptyIntegrationsState onConnectClick={handleConnectClick} />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedIntegrations).map(([category, items]) => (
                <IntegrationCategory
                  key={category}
                  category={category}
                  integrations={items}
                  onDisconnect={handleDisconnect}
                  onReconnect={handleReconnect}
                  isLoading={isDisconnectLoading || isReconnectLoading}
                />
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
              disabled={isConnectLoading}
            >
              {isConnectLoading ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationsList;
