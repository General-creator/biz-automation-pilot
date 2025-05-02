
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import IntegrationsList from "@/components/IntegrationsList";
import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { useState } from "react";
import IntegrationConnectForm from "@/components/integrations/IntegrationConnectForm";

const Integrations = () => {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Integration Settings</h1>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsConnectDialogOpen(true)}
            >
              <Cog className="h-4 w-4" />
              Connect New Integration
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Manage Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <IntegrationsList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <IntegrationConnectForm 
        isOpen={isConnectDialogOpen}
        onClose={() => setIsConnectDialogOpen(false)}
      />
    </div>
  );
};

export default Integrations;
