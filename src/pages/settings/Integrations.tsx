
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
      <main className="flex-1 bg-gradient-to-br from-[#4D7C79]/5 to-[#D94A38]/5 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gradient-orbit">Integration Settings</h1>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2 bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28]"
              onClick={() => setIsConnectDialogOpen(true)}
            >
              <Cog className="h-4 w-4" />
              Connect New Integration
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-[#4D7C79]">Manage Integrations</CardTitle>
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
