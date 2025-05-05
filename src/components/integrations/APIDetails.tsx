
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
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

  const exampleCode = `
// Example POST request
fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
  },
  body: JSON.stringify({
    data: {
      // Your data goes here
      message: "Hello from your automation!"
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
  `.trim();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration API Details</CardTitle>
        <CardDescription>
          Use these credentials to connect your automation to our platform
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
        </div>

        <div className="pt-2">
          <label className="text-sm font-medium">Example Usage</label>
          <div className="mt-1 p-4 bg-muted rounded-md overflow-x-auto">
            <pre className="text-xs font-mono">{exampleCode}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIDetails;
