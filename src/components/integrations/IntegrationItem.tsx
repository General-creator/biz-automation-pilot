
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Integration } from "@/types/integration";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import APIDetails from "./APIDetails";

interface IntegrationItemProps {
  integration: Integration;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  isLoading: boolean;
}

const IntegrationItem = ({ 
  integration, 
  onDisconnect, 
  onReconnect, 
  isLoading 
}: IntegrationItemProps) => {
  const [showApiDetails, setShowApiDetails] = useState(false);
  
  // Generate a deterministic API key based on the integration ID
  // In a real app, this would be stored securely and retrieved from the server
  const apiKey = `api_${integration.id.substring(0, 16)}`;
  
  // Create a webhook URL with the integration ID
  const webhookUrl = `https://api.yourdomain.com/integrations/${integration.id}/webhook`;
  
  return (
    <>
      <div className="flex items-center justify-between p-3 border rounded-md">
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
        <div className="flex gap-2">
          {integration.isConnected && integration.type === "workflow" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiDetails(true)}
            >
              API Details
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => 
              integration.isConnected 
                ? onDisconnect(integration.id) 
                : onReconnect(integration.id)
            }
            disabled={isLoading}
          >
            {integration.isConnected ? "Disconnect" : "Reconnect"}
          </Button>
        </div>
      </div>
      
      <Dialog open={showApiDetails} onOpenChange={setShowApiDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>API Details for {integration.name}</DialogTitle>
          </DialogHeader>
          <APIDetails 
            integrationId={integration.id}
            apiKey={apiKey}
            webhookUrl={webhookUrl}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationItem;
