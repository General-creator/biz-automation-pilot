
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Copy, Check, Book, FileText, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Documentation = () => {
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [id]: true }));
    toast.success("Code copied to clipboard");
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Documentation</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 space-y-4">
              <div className="rounded-lg border bg-card shadow-sm p-2">
                <NavigationMenu orientation="vertical" className="max-w-none w-full">
                  <NavigationMenuList className="flex-col space-y-1 items-start">
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle() + " w-full justify-start"}
                        asChild
                      >
                        <a href="#getting-started">
                          <Book className="h-4 w-4 mr-2" />
                          Getting Started
                        </a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle() + " w-full justify-start"}
                        asChild
                      >
                        <a href="#features">
                          <Info className="h-4 w-4 mr-2" />
                          Features
                        </a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuTrigger className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Integrations
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-full">
                        <ul className="grid gap-1 p-2 w-64">
                          <li>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle() + " w-full justify-start"}
                              asChild
                            >
                              <a href="#make-integration">Make Integration</a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle() + " w-full justify-start"}
                              asChild
                            >
                              <a href="#zapier-integration">Zapier Integration</a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle() + " w-full justify-start"}
                              asChild
                            >
                              <a href="#hubspot-integration">HubSpot Integration</a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle() + " w-full justify-start"}
                              asChild
                            >
                              <a href="#api-reference">API Reference</a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-md font-semibold mb-2">Need more help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check our help section or contact support for assistance.
                  </p>
                  <Button asChild variant="orbit" size="sm" className="w-full">
                    <Link to="/settings/help">Go to Help Center</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Documentation Content */}
            <div className="flex-1 space-y-8">
              {/* Getting Started Section */}
              <Card id="getting-started">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5" /> Getting Started with Orbit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What is Orbit?</h3>
                    <p>
                      Orbit is an automation intelligence platform that helps you monitor, track, and optimize your 
                      workflow automations across various platforms like Make, Zapier, and HubSpot. It provides 
                      analytics, alerts, and insights to ensure your automations are running efficiently.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Setup Guide</h3>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>
                        Create an account or log in to your Orbit dashboard
                      </li>
                      <li>
                        Connect your first integration by going to Settings &gt; Integrations
                      </li>
                      <li>
                        Generate an API key and copy the webhook URL for your automation platform
                      </li>
                      <li>
                        Configure your automation tools to send data to Orbit
                      </li>
                      <li>
                        Start monitoring your automations from the dashboard
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Features Section */}
              <Card id="features">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" /> Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                      <p className="text-sm text-gray-600">
                        Real-time performance metrics and insights into all your automations.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Cross-Platform Monitoring</h3>
                      <p className="text-sm text-gray-600">
                        Track automations from multiple providers in one central location.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Alert System</h3>
                      <p className="text-sm text-gray-600">
                        Get notified when automations fail or perform unexpectedly.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Historical Data</h3>
                      <p className="text-sm text-gray-600">
                        Access detailed logs and trends to optimize automation performance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration: Make */}
              <Card id="make-integration">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" /> Make Integration
                    </CardTitle>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Integrate Orbit with Make.com (formerly Integromat) to track your scenario runs,
                    monitor execution costs, and get insights into your Make workflows.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold">Integration Steps:</h3>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Create a new integration from the Settings &gt; Integrations page</li>
                      <li>Select "Make" as your integration type</li>
                      <li>Copy your API key and webhook URL</li>
                      <li>In Make, add an HTTP module to your scenario</li>
                      <li>Configure the HTTP module using the setup code below</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Make.com HTTP Module Setup</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleCopy('make-code', `// Make.com HTTP Module Setup:

URL: https://api.yourapp.com/runs/log
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY

Body (JSON):
{
  "automationName": "{{scenario.name}}",
  "status": "{{1.status}}",
  "timestamp": "{{formatDate(now; YYYY-MM-DD HH:mm:ss)}}",
  "message": "{{1.message}}"
}`)}
                      >
                        {copyStatus['make-code'] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
{`// Make.com HTTP Module Setup:

URL: https://api.yourapp.com/runs/log
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY

Body (JSON):
{
  "automationName": "{{scenario.name}}",
  "status": "{{1.status}}",
  "timestamp": "{{formatDate(now; YYYY-MM-DD HH:mm:ss)}}",
  "message": "{{1.message}}"
}`}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button asChild variant="link" size="sm" className="flex items-center gap-1 text-xs">
                      <a href="https://www.make.com/en/help/tools/http" target="_blank" rel="noopener noreferrer">
                        Make HTTP Documentation <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Integration: Zapier */}
              <Card id="zapier-integration">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Zapier Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Connect Orbit with Zapier to monitor your Zaps and get insights into your automation workflows.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold">Integration Steps:</h3>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Create a new integration from the Settings &gt; Integrations page</li>
                      <li>Select "Zapier" as your integration type</li>
                      <li>Copy your API key and webhook URL</li>
                      <li>In Zapier, add a "Code by Zapier" step to your Zap</li>
                      <li>Paste the code below into the Code editor</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Zapier Code Step</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleCopy('zapier-code', `// Zapier Code Step
const response = await fetch("https://api.yourapp.com/runs/log", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
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
return result;`)}
                      >
                        {copyStatus['zapier-code'] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
{`// Zapier Code Step
const response = await fetch("https://api.yourapp.com/runs/log", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
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
return result;`}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button asChild variant="link" size="sm" className="flex items-center gap-1 text-xs">
                      <a href="https://zapier.com/apps/code/integrations" target="_blank" rel="noopener noreferrer">
                        Zapier Code Documentation <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Integration: HubSpot */}
              <Card id="hubspot-integration">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> HubSpot Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Connect Orbit with HubSpot to monitor your workflow executions and get insights into your automation performance.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold">Integration Steps:</h3>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Create a new integration from the Settings &gt; Integrations page</li>
                      <li>Select "HubSpot" as your integration type</li>
                      <li>Copy your API key and webhook URL</li>
                      <li>In HubSpot, add a "Custom Code" action to your workflow</li>
                      <li>Paste the code below into the HubSpot Custom Code editor</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">HubSpot Custom Code Action</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleCopy('hubspot-code', `// HubSpot Custom Code Action
const axios = require('axios');

exports.main = async (event, callback) => {
  try {
    const response = await axios.post('https://api.yourapp.com/runs/log', {
      automationName: "HubSpot Workflow - " + event.inputFields.workflow_name,
      status: event.inputFields.status || "success",
      timestamp: new Date().toISOString(),
      message: event.inputFields.message || "Executed from HubSpot"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
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
};`)}
                      >
                        {copyStatus['hubspot-code'] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
{`// HubSpot Custom Code Action
const axios = require('axios');

exports.main = async (event, callback) => {
  try {
    const response = await axios.post('https://api.yourapp.com/runs/log', {
      automationName: "HubSpot Workflow - " + event.inputFields.workflow_name,
      status: event.inputFields.status || "success",
      timestamp: new Date().toISOString(),
      message: event.inputFields.message || "Executed from HubSpot"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
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
};`}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button asChild variant="link" size="sm" className="flex items-center gap-1 text-xs">
                      <a href="https://developers.hubspot.com/docs/api/workflows/custom-code-actions" target="_blank" rel="noopener noreferrer">
                        HubSpot Custom Code Documentation <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* API Reference */}
              <Card id="api-reference">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> API Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The Orbit API allows you to programmatically interact with your automation data.
                    Use these endpoints to log run data, fetch statistics, and manage your integrations.
                  </p>
                  
                  <Tabs defaultValue="auth">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="auth">Authentication</TabsTrigger>
                      <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                      <TabsTrigger value="responses">Response Codes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="auth" className="p-4 border rounded-md mt-2">
                      <h3 className="text-md font-semibold mb-2">API Authentication</h3>
                      <p className="mb-2">All API requests require authentication using an API key in the request header:</p>
                      <div className="bg-gray-50 p-2 rounded mb-2">
                        <code>Authorization: Bearer YOUR_API_KEY</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You can find your API key in the integration details page after creating an integration.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="endpoints" className="space-y-4 p-4 border rounded-md mt-2">
                      <div>
                        <h3 className="text-md font-semibold mb-2">POST /runs/log</h3>
                        <p className="text-sm mb-2">Log an automation run to Orbit</p>
                        <div className="bg-gray-50 p-2 rounded">
                          <pre className="text-xs">
{`// Request Body
{
  "automationName": "string", // Required
  "status": "string",         // Required: "success", "error", "warning"
  "timestamp": "string",      // Required: ISO 8601 format
  "message": "string",        // Optional: Additional context
  "cost": number              // Optional: Execution cost (Make only)
}`}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">GET /automations/:id/status</h3>
                        <p className="text-sm mb-2">Get the status of a specific automation</p>
                        <div className="bg-gray-50 p-2 rounded">
                          <pre className="text-xs">
{`// Response
{
  "automationId": "string",
  "name": "string",
  "status": "string",
  "lastRunTimestamp": "string",
  "runCount": number,
  "errorCount": number,
  "averageCost": number
}`}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">GET /workspaces/:id/automations</h3>
                        <p className="text-sm mb-2">List all automations in a workspace</p>
                        <div className="bg-gray-50 p-2 rounded">
                          <pre className="text-xs">
{`// Response
{
  "automations": [
    {
      "id": "string",
      "name": "string",
      "status": "string",
      "lastRunTimestamp": "string",
      "platform": "string"
    }
  ],
  "count": number,
  "workspace": {
    "id": "string",
    "name": "string"
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="responses" className="p-4 border rounded-md mt-2">
                      <h3 className="text-md font-semibold mb-2">Response Codes</h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="font-semibold text-green-600 w-16">200</span>
                          <span>Success - The request was processed successfully</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-orange-600 w-16">400</span>
                          <span>Bad Request - The request is invalid or missing required parameters</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-red-600 w-16">401</span>
                          <span>Unauthorized - Missing or invalid API key</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-red-600 w-16">403</span>
                          <span>Forbidden - Your API key doesn't have permission for this resource</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-red-600 w-16">404</span>
                          <span>Not Found - The requested resource was not found</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-red-600 w-16">429</span>
                          <span>Too Many Requests - You've exceeded the rate limit</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-red-600 w-16">500</span>
                          <span>Server Error - An error occurred on the server</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <div className="flex justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">Ready to get started?</h3>
                  <p className="text-sm text-muted-foreground">Connect your first integration now.</p>
                </div>
                <Button asChild className="flex items-center">
                  <Link to="/settings/integrations">
                    Go to Integrations <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
