
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { saveIntegration, supportedIntegrations, ConnectionData } from "@/integrations/integration-service";

interface IntegrationConnectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntegrationConnectForm = ({ isOpen, onClose }: IntegrationConnectFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [integrationName, setIntegrationName] = useState("");
  const [integrationType, setIntegrationType] = useState("");
  const [connectionFields, setConnectionFields] = useState<ConnectionData>({});
  const [integrationInfo, setIntegrationInfo] = useState<{ fields: string[], documentation: string } | null>(null);
  
  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setIntegrationName("");
      setIntegrationType("");
      setConnectionFields({});
      setIntegrationInfo(null);
    }
  }, [isOpen]);
  
  // Update required fields based on connection type 
  useEffect(() => {
    if (integrationType) {
      // Default fields for API connections
      const fields = ["api_key"];
      const documentation = "https://docs.example.com";
      
      setIntegrationInfo({
        fields,
        documentation
      });
      
      // Initialize fields object
      const initialFields: ConnectionData = {};
      fields.forEach(field => {
        initialFields[field] = "";
      });
      setConnectionFields(initialFields);
    } else {
      setIntegrationInfo(null);
    }
  }, [integrationType]);
  
  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      if (!integrationType) throw new Error("No integration type selected");
      if (!integrationName.trim()) throw new Error("Integration name is required");
      
      return saveIntegration(user.id, integrationName, integrationType, connectionFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Connection failed", {
        description: error.message
      });
    }
  });
  
  const handleInputChange = (field: string, value: string) => {
    setConnectionFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleConnect = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to connect an integration."
      });
      return;
    }
    
    if (!integrationType) {
      toast.error("Select an integration type", {
        description: "Please select an integration type."
      });
      return;
    }
    
    if (!integrationName.trim()) {
      toast.error("Enter integration name", {
        description: "Please enter a name for this integration."
      });
      return;
    }
    
    // Validate all fields are filled
    const missingFields = Object.entries(connectionFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      toast.error("Missing required fields", {
        description: `Please fill in: ${missingFields.join(", ")}`
      });
      return;
    }
    
    connectMutation.mutate();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Integration</DialogTitle>
          <DialogDescription>
            Set up a connection with an external service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Integration Type</Label>
            <Select 
              value={integrationType} 
              onValueChange={setIntegrationType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select integration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Integration Name</Label>
            <Input
              placeholder="Enter integration name"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
            />
          </div>
          
          {integrationInfo && (
            <>
              {integrationInfo.documentation && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{integrationType}</Badge>
                        <span className="text-xs text-muted-foreground">Documentation</span>
                      </div>
                      <a 
                        href={integrationInfo.documentation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-primary hover:underline"
                      >
                        View docs <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Enter the credentials required to connect to this integration.
                </AlertDescription>
              </Alert>
              
              {integrationInfo.fields.map((field) => (
                <div key={field} className="grid gap-2">
                  <Label htmlFor={`field-${field}`}>
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                  <Input
                    id={`field-${field}`}
                    type={field.includes("key") || field.includes("secret") || field.includes("password") ? "password" : "text"}
                    value={connectionFields[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${field.split('_').join(' ')}`}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={connectMutation.isPending}
          >
            {connectMutation.isPending ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConnectForm;

