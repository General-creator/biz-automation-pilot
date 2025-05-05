
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Create a Supabase client
const supabaseUrl = "https://ohbugduzkifavxzrgjdn.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to verify API key
async function verifyApiKey(apiKey: string) {
  if (!apiKey) {
    return { valid: false, userId: null, message: "API key is required" };
  }

  try {
    // Look up the API key in the integrations table
    const { data, error } = await supabase
      .from("integrations")
      .select("user_id, id")
      .eq("api_key", apiKey)
      .eq("status", "connected")
      .single();

    if (error || !data) {
      return { valid: false, userId: null, message: "Invalid API key" };
    }

    return { valid: true, userId: data.user_id, integrationId: data.id };
  } catch (err) {
    console.error("Error verifying API key:", err);
    return { valid: false, userId: null, message: "Server error during API key verification" };
  }
}

// Handle API test endpoint
async function handleApiTest(apiKey: string) {
  const verification = await verifyApiKey(apiKey);
  
  if (!verification.valid) {
    return new Response(
      JSON.stringify({ success: false, message: verification.message }),
      { 
        status: 401, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: "API key is valid" }),
    { 
      status: 200, 
      headers: { "Content-Type": "application/json", ...corsHeaders } 
    }
  );
}

// Handle automation run logging
async function handleLogRun(apiKey: string, payload: any) {
  const verification = await verifyApiKey(apiKey);
  
  if (!verification.valid) {
    return new Response(
      JSON.stringify({ success: false, message: verification.message }),
      { 
        status: 401, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    // Extract data from payload
    const { automationName, status, timestamp, message = "" } = payload;
    
    if (!automationName || !status) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Find or create automation record
    let automation;
    const { data: existingAutomation, error: findError } = await supabase
      .from("automations")
      .select("id")
      .eq("user_id", verification.userId)
      .eq("name", automationName)
      .single();
    
    if (findError || !existingAutomation) {
      // Create new automation
      const { data: newAutomation, error: createError } = await supabase
        .from("automations")
        .insert({
          name: automationName,
          platform: "make", // Specify Make as the platform
          user_id: verification.userId,
          status: "active",
        })
        .select()
        .single();
      
      if (createError) throw createError;
      automation = newAutomation;
    } else {
      automation = existingAutomation;
    }

    // Log the activity
    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .insert({
        automation_id: automation.id,
        user_id: verification.userId,
        automation_name: automationName,
        status: status,
        message: message,
        platform: "make", // Specify Make as the platform
        timestamp: timestamp || new Date().toISOString(),
      })
      .select();

    if (activityError) throw activityError;

    // Update automation's last run details
    await supabase
      .from("automations")
      .update({
        last_run: new Date().toISOString(),
        runs_today: supabase.rpc("increment_runs", { automation_id: automation.id }),
        failed_runs: status.toLowerCase() === "error" || status.toLowerCase() === "failed" 
          ? supabase.rpc("increment_failures", { automation_id: automation.id })
          : undefined,
      })
      .eq("id", automation.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Run logged successfully",
        data: { 
          activityId: activity[0].id,
          automationId: automation.id,
          timestamp: activity[0].timestamp
        }
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (err) {
    console.error("Error logging automation run:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error logging run" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
}

// Handle Get Automations endpoint
async function handleGetAutomations(apiKey: string, workspaceId?: string) {
  const verification = await verifyApiKey(apiKey);
  
  if (!verification.valid) {
    return new Response(
      JSON.stringify({ success: false, message: verification.message }),
      { 
        status: 401, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    // Get automations for the user (in a real multi-workspace app, you'd filter by workspace)
    const { data: automations, error } = await supabase
      .from("automations")
      .select("id, name, platform, status, last_run, next_run, runs_today, failed_runs")
      .eq("user_id", verification.userId)
      .eq("platform", "make");
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: automations 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (err) {
    console.error("Error retrieving automations:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error retrieving automations" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
}

// Handle Get Automation Status endpoint
async function handleGetAutomationStatus(apiKey: string, automationId: string) {
  const verification = await verifyApiKey(apiKey);
  
  if (!verification.valid) {
    return new Response(
      JSON.stringify({ success: false, message: verification.message }),
      { 
        status: 401, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    // Verify user has access to this automation
    const { data: automation, error: automationError } = await supabase
      .from("automations")
      .select("id, name, platform, status, last_run, next_run, runs_today, failed_runs")
      .eq("id", automationId)
      .eq("user_id", verification.userId)
      .single();
    
    if (automationError || !automation) {
      return new Response(
        JSON.stringify({ success: false, message: "Automation not found" }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Get recent activities for this automation
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select("id, timestamp, status, message")
      .eq("automation_id", automationId)
      .order("timestamp", { ascending: false })
      .limit(10);
    
    if (activitiesError) throw activitiesError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          automation,
          activities: activities || []
        }
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (err) {
    console.error("Error retrieving automation status:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error retrieving automation status" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse URL and route the request
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/orbit-api/, "");
  
  // Extract API key from Authorization header
  const authHeader = req.headers.get("authorization") || "";
  const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  // Handle different API endpoints
  try {
    if (path === "/auth/test" && req.method === "GET") {
      return await handleApiTest(apiKey);
    } 
    else if (path === "/runs/log" && req.method === "POST") {
      const payload = await req.json();
      return await handleLogRun(apiKey, payload);
    }
    else if (path.startsWith("/workspaces") && path.includes("/automations") && req.method === "GET") {
      // Extract workspace ID from path
      const workspaceId = path.split("/")[2];
      return await handleGetAutomations(apiKey, workspaceId);
    }
    else if (path.startsWith("/automations/") && path.includes("/status") && req.method === "GET") {
      // Extract automation ID from path
      const automationId = path.split("/")[2];
      return await handleGetAutomationStatus(apiKey, automationId);
    }
    else {
      return new Response(
        JSON.stringify({ success: false, message: "Endpoint not found" }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
  } catch (err) {
    console.error("Error handling request:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
