
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IntegrationFormValues, integrationFormSchema, IntegrationInfo } from "@/components/integrations/forms/integration-form-types";
import { saveIntegration, reconnectIntegration as reconnectIntegrationService, ConnectionData } from "@/integrations/integration-service";
import { Integration } from "@/types/integration";

interface UseIntegrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  reconnectIntegration?: Integration | null;
  userId: string | null;
}

export const useIntegrationForm = ({ 
  isOpen, 
  onClose, 
  reconnectIntegration,
  userId
}: UseIntegrationFormProps) => {
  const [authType, setAuthType] = useState<"api_key" | "oauth">("api_key");
  const [integrationInfo, setIntegrationInfo] = useState<IntegrationInfo | null>(null);
  const queryClient = useQueryClient();
  const isReconnecting = !!reconnectIntegration;
  
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
  
  // Set form values when reconnecting
  useEffect(() => {
    if (isOpen && reconnectIntegration) {
      form.reset({
        integrationName: reconnectIntegration.name,
        integrationType: reconnectIntegration.type,
        authType: "api_key", // Default to API key, actual auth type needs to be retrieved from backend
        apiKey: "",
        apiSecret: "",
        clientId: "",
        clientSecret: ""
      });
    }
  }, [isOpen, reconnectIntegration, form]);
  
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
  
  // Connect mutation
  const connectMutation = useMutation({
    mutationFn: async (values: IntegrationFormValues) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Build connection data based on auth type
      const connectionData: ConnectionData = {};
      
      if (values.authType === "api_key") {
        if (values.apiKey) connectionData.api_key = values.apiKey;
        if (values.apiSecret) connectionData.api_secret = values.apiSecret;
      } else if (values.authType === "oauth") {
        if (values.clientId) connectionData.client_id = values.clientId;
        if (values.clientSecret) connectionData.client_secret = values.clientSecret;
      }
      
      return saveIntegration(userId, values.integrationName, values.integrationType, connectionData);
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
  
  // Reconnect mutation
  const reconnectMutation = useMutation({
    mutationFn: async (data: { values: IntegrationFormValues; integrationId: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Build connection data based on auth type
      const connectionData: ConnectionData = {};
      const values = data.values;
      
      if (values.authType === "api_key") {
        if (values.apiKey) connectionData.api_key = values.apiKey;
        if (values.apiSecret) connectionData.api_secret = values.apiSecret;
      } else if (values.authType === "oauth") {
        if (values.clientId) connectionData.client_id = values.clientId;
        if (values.clientSecret) connectionData.client_secret = values.clientSecret;
      }
      
      return reconnectIntegrationService(data.integrationId, connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
      toast.success("Integration reconnected successfully");
    },
    onError: (error: Error) => {
      toast.error("Reconnection failed", {
        description: error.message
      });
    }
  });
  
  const onSubmit = (values: IntegrationFormValues) => {
    if (!userId) {
      toast.error("Authentication required", {
        description: "You must be logged in to connect an integration."
      });
      return;
    }
    
    if (isReconnecting && reconnectIntegration) {
      reconnectMutation.mutate({ 
        values: values, 
        integrationId: reconnectIntegration.id 
      });
    } else {
      connectMutation.mutate(values);
    }
  };

  return {
    form,
    authType,
    setAuthType,
    integrationInfo,
    onSubmit,
    isReconnecting,
    isPending: connectMutation.isPending || reconnectMutation.isPending
  };
};
