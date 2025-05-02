
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
  automationCount: number;
  category: "workflow" | "crm" | "email" | "payment" | "data";
}

interface IntegrationsListProps {
  integrations: Integration[];
}

const IntegrationsList = ({ integrations }: IntegrationsListProps) => {
  const handleConnect = (integration: Integration) => {
    toast(`Connecting to ${integration.name}`, {
      description: "This would connect to the integration's API.",
    });
  };

  const getCategoryBadge = (category: Integration["category"]) => {
    const categories = {
      workflow: "bg-purple-100 text-purple-800",
      crm: "bg-blue-100 text-blue-800",
      email: "bg-orange-100 text-orange-800",
      payment: "bg-green-100 text-green-800",
      data: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          categories[category]
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded overflow-hidden flex items-center justify-center bg-muted">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    {getCategoryBadge(integration.category)}
                    {integration.isConnected && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {integration.isConnected ? (
                  <div className="text-sm text-muted-foreground">
                    {integration.automationCount} automation
                    {integration.automationCount !== 1 ? "s" : ""} connected
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect(integration)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsList;
