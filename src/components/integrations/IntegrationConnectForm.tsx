
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
import { AlertCircle, ExternalLink, KeyRound, Shield } from "lucide-react";
import { toast } from "sonner";
import { saveIntegration, supportedIntegrations, ConnectionData } from "@/integrations/integration-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IntegrationConnectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Form validation schema
const integrationFormSchema = z.object({
  integrationName: z.string().min(1, "Integration name is required"),
  integrationType: z.string().min(1, "Integration type is required"),
  authType: z.enum(["api_key", "oauth"]),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional()
});

type IntegrationFormValues = z.infer<typeof integrationFormSchema>;

const IntegrationConnectForm = ({ isOpen, onClose }: IntegrationConnectFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [authType, setAuthType] = useState<"api_key" | "oauth">("api_key");
  const [integrationInfo, setIntegrationInfo] = useState<{ fields: string[], documentation: string } | null>(null);
  
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      integrationName: "",
      integrationType: "",
      authType: "api_key",
      apiKey: "",
      apiSecret: "",
      clientId: "",
      clientSecret: ""
    }
  });
  
  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setIntegrationInfo(null);
    }
  }, [isOpen, form]);
  
  // Update required fields based on connection type 
  useEffect(() => {
    const integrationType = form.watch("integrationType");
    if (integrationType) {
      // Default fields for connections based on type
      let fields: string[] = [];
      let documentation = "";
      
      if (integrationType === "workflow") {
        fields = ["api_key"];
        documentation = "https://docs.lovable.dev/integrations/workflows";
      } else if (integrationType === "agent") {
        fields = ["api_key"];
        documentation = "https://docs.lovable.dev/integrations/agents";
      }
      
      setIntegrationInfo({
        fields,
        documentation
      });
    } else {
      setIntegrationInfo(null);
    }
  }, [form.watch("integrationType")]);
  
  const connectMutation = useMutation({
    mutationFn: async (values: IntegrationFormValues) => {
      if (!user) throw new Error("User not authenticated");
      
      // Build connection data based on auth type
      const connectionData: ConnectionData = {};
      
      if (values.authType === "api_key") {
        if (values.apiKey) connectionData.api_key = values.apiKey;
        if (values.apiSecret) connectionData.api_secret = values.apiSecret;
      } else if (values.authType === "oauth") {
        if (values.clientId) connectionData.client_id = values.clientId;
        if (values.clientSecret) connectionData.client_secret = values.clientSecret;
      }
      
      return saveIntegration(user.id, values.integrationName, values.integrationType, connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
      toast.success("Integration connected successfully");
    },
    onError: (error: Error) => {
      toast.error("Connection failed", {
        description: error.message
      });
    }
  });
  
  const onSubmit = (values: IntegrationFormValues) => {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to connect an integration."
      });
      return;
    }
    
    connectMutation.mutate(values);
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="integrationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select integration type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="workflow">Workflow</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="integrationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter integration name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="authType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authentication Type</FormLabel>
                  <Tabs 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setAuthType(value as "api_key" | "oauth");
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="api_key" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        API Key
                      </TabsTrigger>
                      <TabsTrigger value="oauth" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        OAuth
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="api_key" className="mt-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter API key" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="apiSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Secret (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter API secret" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="oauth" className="mt-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter client ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="clientSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Secret</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter client secret" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {integrationInfo?.documentation && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{form.watch("integrationType")}</Badge>
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
                {authType === "api_key" 
                  ? "Enter the API credentials required to connect to this integration." 
                  : "Enter the OAuth client credentials for this integration."}
              </AlertDescription>
            </Alert>
            
            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={connectMutation.isPending}
              >
                {connectMutation.isPending ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConnectForm;
