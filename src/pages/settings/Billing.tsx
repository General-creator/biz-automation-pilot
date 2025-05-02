
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Package,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const Billing = () => {
  const handleUpgrade = () => {
    toast("Upgrade initiated", {
      description: "Redirecting to the payment page...",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Billing & Subscription</h1>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Free Plan</h3>
                      </div>
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">3 automations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">5 integrations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">1,000 runs per month</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button onClick={handleUpgrade} className="w-full">Upgrade Plan</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="mb-1 font-medium">No payment methods</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Add a payment method to upgrade your plan
                    </p>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Pro Plan</h3>
                    <p className="text-2xl font-bold">$19<span className="text-sm font-normal">/month</span></p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>✓ Unlimited automations</li>
                      <li>✓ Unlimited integrations</li>
                      <li>✓ 10,000 runs per month</li>
                      <li>✓ Priority support</li>
                    </ul>
                    <Button variant="outline" onClick={handleUpgrade} className="mt-4 w-full">Select</Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Enterprise</h3>
                    <p className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>✓ Everything in Pro</li>
                      <li>✓ Unlimited runs</li>
                      <li>✓ Dedicated support</li>
                      <li>✓ Custom integrations</li>
                    </ul>
                    <Button variant="outline" onClick={handleUpgrade} className="mt-4 w-full">Contact Sales</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
