
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import IntegrationsList from "@/components/IntegrationsList";

const Integrations = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Integration Settings</h1>
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
    </div>
  );
};

export default Integrations;
