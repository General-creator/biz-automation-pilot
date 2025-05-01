
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AutomationCard, { Automation } from "@/components/AutomationCard";
import ActivityLog, { ActivityItem } from "@/components/ActivityLog";
import NotificationPanel, { Notification } from "@/components/NotificationPanel";
import EmptyState from "@/components/EmptyState";
import IntegrationsList from "@/components/IntegrationsList";
import { CirclePlay, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  // Sample data for automations
  const [automations] = useState<Automation[]>([
    {
      id: "1",
      name: "New Lead Follow-up",
      description: "Send an email when a new lead is created in HubSpot",
      platform: "Zapier",
      status: "active",
      lastRun: "Today, 2:30 PM",
      nextRun: "Today, 6:30 PM",
      runsToday: 12,
      failedRuns: 0
    },
    {
      id: "2",
      name: "Invoice Paid Notification",
      description: "Notify team when a new invoice is paid in Stripe",
      platform: "Stripe",
      status: "paused",
      lastRun: "Yesterday, 5:45 PM",
      runsToday: 3,
      failedRuns: 0
    },
    {
      id: "3",
      name: "Weekly Report Generator",
      description: "Generate weekly reports from Airtable data",
      platform: "Airtable",
      status: "failed",
      lastRun: "Today, 9:00 AM",
      runsToday: 1,
      failedRuns: 1
    },
    {
      id: "4",
      name: "Customer Onboarding Sequence",
      description: "Send onboarding emails to new customers",
      platform: "HubSpot",
      status: "active",
      lastRun: "Today, 3:15 PM",
      nextRun: "Today, 7:15 PM",
      runsToday: 5,
      failedRuns: 0
    },
    {
      id: "5",
      name: "Support Ticket Alerts",
      description: "Send alerts for high priority support tickets",
      platform: "Make",
      status: "active",
      lastRun: "Today, 4:20 PM",
      nextRun: "Today, 8:20 PM",
      runsToday: 8,
      failedRuns: 0
    }
  ]);

  // Sample data for activities
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      automationName: "New Lead Follow-up",
      platform: "Zapier",
      status: "success",
      timestamp: "Today, 2:30 PM",
      message: "Email sent to new lead: john.doe@example.com"
    },
    {
      id: "2",
      automationName: "Invoice Paid Notification",
      platform: "Stripe",
      status: "success",
      timestamp: "Yesterday, 5:45 PM",
      message: "Team notified about invoice #INV-2023-004"
    },
    {
      id: "3",
      automationName: "Weekly Report Generator",
      platform: "Airtable",
      status: "failure",
      timestamp: "Today, 9:00 AM",
      message: "Failed to access Airtable API: Authentication error"
    },
    {
      id: "4",
      automationName: "Customer Onboarding Sequence",
      platform: "HubSpot",
      status: "success",
      timestamp: "Today, 3:15 PM",
      message: "Onboarding email sent to 5 new customers"
    },
    {
      id: "5",
      automationName: "Support Ticket Alerts",
      platform: "Make",
      status: "success",
      timestamp: "Today, 4:20 PM",
      message: "Alert sent for ticket #T-2023-089: Critical issue"
    }
  ]);

  // Sample data for notifications
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      automationName: "Weekly Report Generator",
      message: "Failed to access Airtable API: Authentication error",
      timestamp: "Today, 9:00 AM",
      severity: "high"
    },
    {
      id: "2",
      automationName: "Customer Data Sync",
      message: "5 consecutive failures detected",
      timestamp: "Yesterday, 11:30 PM",
      severity: "medium"
    }
  ]);

  // Sample data for integrations
  const [integrations] = useState([
    {
      id: "1",
      name: "Zapier",
      logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
      isConnected: true,
      automationCount: 2,
      category: "workflow"
    },
    {
      id: "2",
      name: "Make (Integromat)",
      logo: "https://images.ctfassets.net/qqlj6g4ee76j/7HzRrlvRzl271CMotqRjPR/dd936ac36c125b5ca384e0316f7c8a31/Make-Symbol-Color.svg",
      isConnected: true,
      automationCount: 1,
      category: "workflow"
    },
    {
      id: "3",
      name: "HubSpot",
      logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
      isConnected: true,
      automationCount: 1,
      category: "crm"
    },
    {
      id: "4",
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      isConnected: true,
      automationCount: 1,
      category: "payment"
    },
    {
      id: "5",
      name: "Airtable",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
      isConnected: true,
      automationCount: 1,
      category: "data"
    },
    {
      id: "6",
      name: "Gmail",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      isConnected: false,
      automationCount: 0,
      category: "email"
    }
  ] as any);

  const handleConnectIntegration = () => {
    toast("Connect a new integration", {
      description: "Select from our available integrations to automate your workflows.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to AutoPilot</h2>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your business automations in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          <div className="md:col-span-4">
            <Tabs defaultValue="automations" className="space-y-6">
              <TabsList>
                <TabsTrigger value="automations">Automations</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>
              <TabsContent value="automations" className="space-y-6">
                {automations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {automations.map((automation) => (
                      <AutomationCard key={automation.id} automation={automation} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No automations yet"
                    description="Connect your first integration to start creating automations."
                    actionText="Connect Integration"
                    onAction={handleConnectIntegration}
                    icon={<CirclePlay className="h-6 w-6" />}
                  />
                )}
              </TabsContent>
              <TabsContent value="activity">
                <ActivityLog activities={activities} />
              </TabsContent>
              <TabsContent value="integrations">
                <IntegrationsList integrations={integrations} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-2">
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 AutoPilot. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="inline-flex items-center mr-4">
              <span className="h-2 w-2 rounded-full bg-success mr-1"></span>
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
