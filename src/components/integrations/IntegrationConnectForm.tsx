
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveIntegration, ConnectionData } from "@/integrations/integration-service";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntegrationFormValues, integrationFormSchema, IntegrationInfo } from "./forms/integration-form-types";
import IntegrationTypeSelect from "./forms/IntegrationTypeSelect";
import IntegrationNameInput from "./forms/IntegrationNameInput";
import AuthTypeTabs from "./forms/AuthTypeTabs";
import IntegrationDocumentation from "./forms/IntegrationDocumentation";
import ConnectionHelpAlert from "./forms/ConnectionHelpAlert";
import IntegrationFormActions from "./forms/IntegrationFormActions";

interface IntegrationConnectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntegrationConnectForm = ({ isOpen, onClose }: IntegrationConnectFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [authType, setAuthType] = useState<"api_key" | "oauth">("api_key");
  const [integrationInfo, setIntegrationInfo] = useState<IntegrationInfo | null>(null);
  
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
            <IntegrationTypeSelect control={form.control} />
            <IntegrationNameInput control={form.control} />
            <AuthTypeTabs 
              control={form.control} 
              authType={authType} 
              setAuthType={setAuthType}
            />
            
            {integrationInfo?.documentation && (
              <IntegrationDocumentation 
                integrationType={form.watch("integrationType")} 
                documentationUrl={integrationInfo.documentation} 
              />
            )}
            
            <ConnectionHelpAlert authType={authType} />
            
            <IntegrationFormActions
              onCancel={onClose}
              isPending={connectMutation.isPending}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConnectForm;
