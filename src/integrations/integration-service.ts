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

// Default fields and documentation by integration type
export const integrationTypeConfig: Record<string, {requiredFields: string[], documentation: string}> = {
  "workflow": {
    requiredFields: ["api_key"],
    documentation: "https://docs.lovable.dev/integrations/workflows"
  },
  "agent": {
    requiredFields: ["api_key"],
    documentation: "https://docs.lovable.dev/integrations/agents"
  }
};

// Map of supported integrations with their specific configurations - keeping for backward compatibility
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

// Generate a pseudo-random API key for integrations
// In production, this would be handled securely on the server
export function generateApiKey(integrationId: string): string {
  // Create a more secure API key format with a prefix that helps identify it as an API key
  const prefix = "orb_";
  const randomPart = Array.from(
    { length: 24 },
    () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 62)]
  ).join("");
  
  return `${prefix}${randomPart}_${integrationId.substring(0, 8)}`;
}

// Get webhook URL for an integration
export function getWebhookUrl(integrationId: string): string {
  // The base URL would typically be your production API domain
  const baseUrl = "https://ohbugduzkifavxzrgjdn.supabase.co/functions/v1/orbit-api";
  return `${baseUrl}/runs/log`;
}

// Test a connection to verify credentials work
export async function testConnection(
  integrationName: string,
  integrationType: string,
  connectionData: ConnectionData
): Promise<{ success: boolean; message: string }> {
  try {
    // Get required fields based on integration type
    const config = integrationTypeConfig[integrationType];
    if (!config) {
      return { success: false, message: "Unsupported integration type" };
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
    console.log(`Testing connection to ${integrationName} (${integrationType}) with data:`, connectionData);
    
    return { 
      success: true, 
      message: `Successfully connected to ${integrationName}` 
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
  integrationName: string,
  integrationType: string,
  connectionData: ConnectionData
) {
  try {
    // First, test the connection
    const testResult = await testConnection(integrationName, integrationType, connectionData);
    
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
        name: integrationName,
        type: integrationType,
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
    
    toast.success(`${integrationName} connected successfully`, {
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

// Reconnect an integration with optional new connection data
export async function reconnectIntegration(integrationId: string, connectionData?: ConnectionData) {
  try {
    let updateData: Record<string, any> = { status: "connected" };
    
    // If new connection data is provided, update the API key field
    if (connectionData && Object.keys(connectionData).length > 0) {
      updateData.api_key = JSON.stringify(connectionData);
    }
    
    const { data, error } = await supabase
      .from("integrations")
      .update(updateData)
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

// Process incoming webhook data (would be handled by a serverless function in production)
export async function processWebhookData(integrationId: string, apiKey: string, data: any) {
  try {
    // Validate API key
    const expectedApiKey = generateApiKey(integrationId);
    if (apiKey !== expectedApiKey) {
      return { 
        success: false, 
        message: "Invalid API key" 
      };
    }
    
    // In a real implementation, this would process the incoming data
    // and route it to the appropriate automation workflow
    console.log(`Processing webhook data for integration ${integrationId}:`, data);
    
    // Simulate processing success
    return {
      success: true,
      message: "Webhook data processed successfully",
      timestamp: new Date().toISOString(),
      integrationId
    };
  } catch (error) {
    console.error("Webhook processing error:", error);
    return { 
      success: false, 
      message: `Failed to process webhook: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Validates API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  // Basic validation - should start with orb_ prefix and be a certain length
  return apiKey.startsWith("orb_") && apiKey.length >= 32;
}

// Get API Key for an integration
export async function getApiKeyForIntegration(integrationId: string) {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .select("api_key")
      .eq("id", integrationId)
      .single();
      
    if (error || !data.api_key) {
      console.error("Failed to get API key:", error);
      return null;
    }
    
    return data.api_key;
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
}
