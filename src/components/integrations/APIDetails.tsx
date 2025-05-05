
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface APIDetailsProps {
  integrationId: string;
  apiKey: string;
  webhookUrl: string;
}

const APIDetails = ({ integrationId, apiKey, webhookUrl }: APIDetailsProps) => {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("javascript");

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  // Code examples for different platforms
  const codeExamples = {
    javascript: `
// Example POST request using JavaScript fetch
fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
  },
  body: JSON.stringify({
    automationName: "Your Automation Name",
    status: "success",  // One of: success, error, warning
    timestamp: new Date().toISOString(),
    message: "Automation ran successfully"
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
`.trim(),

    zapier: `
// Zapier Code Step
const response = await fetch("${webhookUrl}", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    automationName: "Zapier Flow - " + inputData.workflow_name,
    status: inputData.status || "success",
    timestamp: new Date().toISOString(),
    message: inputData.message || "Automated with Zapier"
  })
});

// Parse the response
const result = await response.json();
return result;
`.trim(),

    make: `
// Make.com HTTP Module Setup:

URL: ${webhookUrl}
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer ${apiKey}

Body (JSON):
{
  "automationName": "{{scenario.name}}",
  "status": "{{1.status}}",
  "timestamp": "{{formatDate(now; YYYY-MM-DD HH:mm:ss)}}",
  "message": "{{1.message}}"
}

// To find Orbit in Make's app directory:
// 1. Go to Make.com and look for Orbit in the apps directory
// 2. Or search for "Orbit Automation Intelligence" when adding a new module
// 3. See our developer docs at: https://developers.make.com/custom-apps-documentation/basics/create-your-app

// Use the 'Parse JSON' option for the response if needed
`.trim(),

    hubspot: `
// HubSpot Custom Code Action
const axios = require('axios');

exports.main = async (event, callback) => {
  try {
    const response = await axios.post('${webhookUrl}', {
      automationName: "HubSpot Workflow - " + event.inputFields.workflow_name,
      status: event.inputFields.status || "success",
      timestamp: new Date().toISOString(),
      message: event.inputFields.message || "Executed from HubSpot"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${apiKey}'
      }
    });
    
    callback({
      outputFields: {
        status: response.status,
        response: JSON.stringify(response.data)
      }
    });
  } catch (error) {
    callback({
      outputFields: {
        error: error.message
      }
    });
  }
};
`.trim()
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration API Details</CardTitle>
        <CardDescription>
          Use these credentials to connect your automation to Orbit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">API Key</label>
          <div className="flex mt-1">
            <Input
              readOnly
              value={apiKey}
              type="password"
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={handleCopyApiKey}
            >
              {apiKeyCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            This is your unique API key for this integration. Keep it secure.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Webhook URL</label>
          <div className="flex mt-1">
            <Input
              readOnly
              value={webhookUrl}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={handleCopyWebhook}
            >
              {webhookCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Send HTTP POST requests to this URL from your automation platform
          </p>
        </div>

        <div className="pt-2">
          <label className="text-sm font-medium">Integration Examples</label>
          
          <Tabs defaultValue="javascript" value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="zapier">Zapier</TabsTrigger>
              <TabsTrigger value="make">Make</TabsTrigger>
              <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="mt-0">
              <div className="p-4 bg-muted rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">{codeExamples.javascript}</pre>
              </div>
            </TabsContent>
            
            <TabsContent value="zapier" className="mt-0">
              <div className="p-4 bg-muted rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">{codeExamples.zapier}</pre>
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="link" size="sm" className="text-xs flex items-center gap-1" asChild>
                  <a href="https://zapier.com/apps/code/integrations" target="_blank" rel="noopener noreferrer">
                    Zapier Code Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="make" className="mt-0">
              <div className="p-4 bg-muted rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">{codeExamples.make}</pre>
              </div>
              <div className="mt-2 flex justify-between">
                <Button variant="link" size="sm" className="text-xs flex items-center gap-1" asChild>
                  <a href="https://developers.make.com/custom-apps-documentation/basics/create-your-app" target="_blank" rel="noopener noreferrer">
                    Orbit on Make <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
                <Button variant="link" size="sm" className="text-xs flex items-center gap-1" asChild>
                  <a href="https://www.make.com/en/help/tools/http" target="_blank" rel="noopener noreferrer">
                    Make HTTP Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hubspot" className="mt-0">
              <div className="p-4 bg-muted rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">{codeExamples.hubspot}</pre>
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="link" size="sm" className="text-xs flex items-center gap-1" asChild>
                  <a href="https://developers.hubspot.com/docs/api/workflows/custom-code-actions" target="_blank" rel="noopener noreferrer">
                    HubSpot Custom Code Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="pt-2 pb-1 text-xs text-muted-foreground border-t">
          <p className="mt-2">
            This integration will send automation metrics to your Orbit dashboard, allowing you to track performance, 
            usage patterns, and success rates across all your connected platforms.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIDetails;
