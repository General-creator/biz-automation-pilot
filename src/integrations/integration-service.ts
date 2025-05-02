
import { supabase } from "./supabase/client";
import { toast } from "sonner";

// Interface for supported integration types
export interface IntegrationConfig {
  name: string;
  type: string;
  apiEndpoint?: string;
  requiredFields: string[];
  documentation: string;
}

// Map of supported integrations with their specific configurations
export const supportedIntegrations: Record<string, IntegrationConfig> = {
  "Zapier": {
    name: "Zapier",
    type: "workflow",
    apiEndpoint: "https://hooks.zapier.com/hooks/catch/",
    requiredFields: ["webhook_url"],
    documentation: "https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks"
  },
  "Make": {
    name: "Make",
    type: "workflow",
    apiEndpoint: "https://hook.make.com/",
    requiredFields: ["webhook_url"],
    documentation: "https://www.make.com/en/help/tools/webhooks"
  },
  "HubSpot": {
    name: "HubSpot",
    type: "crm",
    apiEndpoint: "https://api.hubapi.com/",
    requiredFields: ["api_key"],
    documentation: "https://developers.hubspot.com/docs/api/overview"
  },
  "Stripe": {
    name: "Stripe",
    type: "payment",
    apiEndpoint: "https://api.stripe.com/v1/",
    requiredFields: ["api_key"],
    documentation: "https://stripe.com/docs/api"
  },
  "Airtable": {
    name: "Airtable",
    type: "data",
    apiEndpoint: "https://api.airtable.com/v0/",
    requiredFields: ["api_key", "base_id"],
    documentation: "https://airtable.com/developers/web/api/introduction"
  },
  "Gmail": {
    name: "Gmail",
    type: "email",
    apiEndpoint: "https://gmail.googleapis.com/gmail/v1/",
    requiredFields: ["client_id", "client_secret"],
    documentation: "https://developers.google.com/gmail/api/guides"
  }
};

// Interface for the connection data
export interface ConnectionData {
  [key: string]: string;
}

// Test a connection to verify credentials work
export async function testConnection(
  integration: string,
  connectionData: ConnectionData,
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // For now we'll simulate testing the connection
    // In a real app, you would make an API call to the integration service
    
    const config = supportedIntegrations[integration];
    if (!config) {
      return { success: false, message: "Unsupported integration" };
    }
    
    // Check if all required fields are present
    for (const field of config.requiredFields) {
      if (!connectionData[field]) {
        return { 
          success: false, 
          message: `Missing required field: ${field}` 
        };
      }
    }
    
    // Simulate API verification
    console.log(`Testing connection to ${integration} with data:`, connectionData);
    
    // In a real implementation, we would validate the credentials with the service
    // For now, we'll simulate success if all required fields are present
    return { 
      success: true, 
      message: `Successfully connected to ${integration}` 
    };
  } catch (error) {
    console.error("Integration test error:", error);
    return { 
      success: false, 
      message: `Failed to connect: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Save integration connection to the database
export async function saveIntegration(
  userId: string,
  integration: string,
  type: string,
  connectionData: ConnectionData
) {
  try {
    // First, test the connection
    const testResult = await testConnection(integration, connectionData, userId);
    
    if (!testResult.success) {
      toast.error("Connection failed", {
        description: testResult.message
      });
      return { success: false, message: testResult.message };
    }
    
    // Save to database
    const { data, error } = await supabase
      .from("integrations")
      .insert({
        user_id: userId,
        name: integration,
        type: type,
        api_key: JSON.stringify(connectionData), // Store connection data as JSON
        status: "connected"
      })
      .select("*");
      
    if (error) {
      toast.error("Failed to save integration", {
        description: error.message
      });
      return { success: false, message: error.message };
    }
    
    toast.success(`${integration} connected successfully`, {
      description: "The integration is now ready to use"
    });
    
    return { 
      success: true, 
      message: "Integration saved successfully",
      data: data[0]
    };
    
  } catch (error) {
    console.error("Save integration error:", error);
    toast.error("Failed to save integration", {
      description: error instanceof Error ? error.message : String(error)
    });
    return { 
      success: false, 
      message: `Failed to save: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Disconnect an integration
export async function disconnectIntegration(integrationId: string) {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .update({ status: "disconnected" })
      .eq("id", integrationId)
      .select("*");
      
    if (error) {
      toast.error("Failed to disconnect integration", {
        description: error.message
      });
      return { success: false, message: error.message };
    }
    
    toast.success("Integration disconnected", {
      description: "The integration has been disconnected successfully"
    });
    
    return { 
      success: true, 
      message: "Integration disconnected successfully",
      data: data[0]
    };
  } catch (error) {
    console.error("Disconnect integration error:", error);
    toast.error("Failed to disconnect integration", {
      description: error instanceof Error ? error.message : String(error)
    });
    return { 
      success: false, 
      message: `Failed to disconnect: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Reconnect an integration
export async function reconnectIntegration(integrationId: string) {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .update({ status: "connected" })
      .eq("id", integrationId)
      .select("*");
      
    if (error) {
      toast.error("Failed to reconnect integration", {
        description: error.message
      });
      return { success: false, message: error.message };
    }
    
    toast.success("Integration reconnected", {
      description: "The integration has been reconnected successfully"
    });
    
    return { 
      success: true, 
      message: "Integration reconnected successfully",
      data: data[0]
    };
  } catch (error) {
    console.error("Reconnect integration error:", error);
    toast.error("Failed to reconnect integration", {
      description: error instanceof Error ? error.message : String(error)
    });
    return { 
      success: false, 
      message: `Failed to reconnect: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}
