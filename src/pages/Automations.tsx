
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Automations = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Automations</h1>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Automation
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground">No automations created yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first automation to get started
                  </p>
                  <Button className="mt-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Automation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Automations;
