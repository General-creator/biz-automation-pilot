
import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AutomationCard, { Automation } from "@/components/AutomationCard";
import ActivityLog, { ActivityItem } from "@/components/ActivityLog";
import NotificationPanel, { Notification } from "@/components/NotificationPanel";
import IntegrationsList from "@/components/IntegrationsList";
import { Button } from "@/components/ui/button";
import { Activity, ArrowUpRight, CheckCircle, Clock, DollarSign, PauseCircle, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";

// Sample data - this would come from your API in a real application
const automations: Automation[] = [
  {
    id: "1",
    name: "New Lead Follow-up Sequence",
    description: "Automatically sends emails to new leads",
    platform: "Make",
    status: "active",
    lastRun: "Today, 2:30 PM",
    nextRun: "Today, 5:30 PM",
    runsToday: 12,
    failedRuns: 0
  },
  {
    id: "2",
    name: "Invoice Payment Processing",
    description: "Processes payments in Stripe when invoices are paid",
    platform: "Zapier",
    status: "active",
    lastRun: "Today, 1:15 PM",
    nextRun: "Today, 4:15 PM",
    runsToday: 8,
    failedRuns: 0
  },
  {
    id: "3",
    name: "Customer Feedback Collection",
    description: "Collects and processes customer feedback",
    platform: "HubSpot",
    status: "paused",
    lastRun: "Yesterday, 3:45 PM",
    nextRun: undefined,
    runsToday: 0,
    failedRuns: 0
  },
  {
    id: "4",
    name: "Inventory Update Notification",
    description: "Sends alerts when inventory levels change",
    platform: "Airtable",
    status: "failed",
    lastRun: "Today, 10:20 AM",
    nextRun: undefined,
    runsToday: 5,
    failedRuns: 3
  }
];

const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    automationName: "New Lead Follow-up Sequence",
    platform: "Make",
    status: "success",
    timestamp: "10 minutes ago",
    message: "Successfully sent 3 follow-up emails to new leads"
  },
  {
    id: "a2",
    automationName: "Invoice Payment Processing",
    platform: "Zapier",
    status: "success",
    timestamp: "25 minutes ago",
    message: "Processed payment for invoice #INV-2023-0458"
  },
  {
    id: "a3",
    automationName: "Inventory Update Notification",
    platform: "Airtable",
    status: "failure",
    timestamp: "45 minutes ago",
    message: "Failed to connect to inventory API endpoint"
  },
  {
    id: "a4",
    automationName: "Invoice Payment Processing",
    platform: "Zapier",
    status: "success",
    timestamp: "1 hour ago",
    message: "Processed payment for invoice #INV-2023-0457"
  }
];

const notifications: Notification[] = [
  {
    id: "n1",
    automationName: "Inventory Update Notification",
    message: "Automation has failed 3 times in the last hour",
    timestamp: "45 minutes ago",
    severity: "high"
  },
  {
    id: "n2",
    automationName: "Customer Data Sync",
    message: "API rate limit approaching (80% used)",
    timestamp: "2 hours ago",
    severity: "medium"
  }
];

const integrations = [
  {
    id: "i1",
    name: "Zapier",
    logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
    isConnected: true,
    automationCount: 8,
    category: "workflow" as const
  },
  {
    id: "i2",
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/7D36NDseRcpUUVLTRCKIXM/cbf2648b639bf89ce7f24d6cf49a0972/make-logo-2.svg",
    isConnected: true,
    automationCount: 5,
    category: "workflow" as const
  },
  {
    id: "i3",
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
    isConnected: true,
    automationCount: 3,
    category: "crm" as const
  },
  {
    id: "i4",
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    isConnected: true,
    automationCount: 2,
    category: "payment" as const
  },
  {
    id: "i5",
    name: "Airtable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    isConnected: true,
    automationCount: 1,
    category: "data" as const
  },
  {
    id: "i6",
    name: "Gmail",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    isConnected: false,
    automationCount: 0,
    category: "email" as const
  }
];

// Sample chart data
const costData = [
  { name: "Jan", cost: 250 },
  { name: "Feb", cost: 320 },
  { name: "Mar", cost: 280 },
  { name: "Apr", cost: 340 },
  { name: "May", cost: 390 },
  { name: "Jun", cost: 310 }
];

const runData = [
  { day: "Mon", successful: 42, failed: 3 },
  { day: "Tue", successful: 38, failed: 2 },
  { day: "Wed", successful: 45, failed: 1 },
  { day: "Thu", successful: 40, failed: 4 },
  { day: "Fri", successful: 35, failed: 2 },
  { day: "Sat", successful: 28, failed: 1 },
  { day: "Sun", successful: 25, failed: 0 }
];

const costConfig = {
  cost: {
    label: "Cost ($)",
    theme: { light: "#3b82f6", dark: "#60a5fa" },
  }
};

const runConfig = {
  successful: {
    label: "Successful Runs",
    theme: { light: "#10b981", dark: "#34d399" },
  },
  failed: {
    label: "Failed Runs",
    theme: { light: "#ef4444", dark: "#f87171" },
  }
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter automations based on search query
  const filteredAutomations = automations.filter(
    (automation) =>
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalAutomations = automations.length;
  const activeAutomations = automations.filter((a) => a.status === "active").length;
  const failedAutomations = automations.filter((a) => a.status === "failed").length;
  const totalRunsToday = automations.reduce((sum, auto) => sum + auto.runsToday, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Automation Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your business automations
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Input 
              placeholder="Search automations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
            />
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Automations</p>
                <p className="text-2xl font-bold">{totalAutomations}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Automations</p>
                <p className="text-2xl font-bold">{activeAutomations}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Paused Automations</p>
                <p className="text-2xl font-bold">{automations.filter(a => a.status === "paused").length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <PauseCircle className="h-5 w-5 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Executions Today</p>
                <p className="text-2xl font-bold">{totalRunsToday}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - left 2/3 */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            
            {/* Analytics charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Monthly Cost</span>
                    <span className="text-lg font-normal text-muted-foreground">$1,890</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={costConfig} className="h-64">
                    <LineChart data={costData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Execution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={runConfig} className="h-64">
                    <BarChart data={runData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="successful" fill="#10b981" stackId="stack" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="failed" fill="#ef4444" stackId="stack" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Automations List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Your Automations</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredAutomations.length > 0 ? (
                    filteredAutomations.map((automation) => (
                      <AutomationCard key={automation.id} automation={automation} />
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No automations found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Automations</TableHead>
                      <TableHead>Monthly Cost</TableHead>
                      <TableHead>Cost per Run</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Zapier</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>$850</TableCell>
                      <TableCell>$0.042</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Make</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>$550</TableCell>
                      <TableCell>$0.035</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">HubSpot</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>$320</TableCell>
                      <TableCell>$0.028</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Stripe</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>$120</TableCell>
                      <TableCell>$0.015</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Airtable</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>$50</TableCell>
                      <TableCell>$0.010</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Activity Log */}
            <ActivityLog activities={recentActivity} />
          </div>

          {/* Sidebar - right 1/3 */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <NotificationPanel notifications={notifications} />
            
            {/* Cost Saving Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-success" />
                  Cost Saving Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="font-medium">Duplicate workflows detected</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Two similar Zapier workflows could be combined to save $25/month
                    </p>
                    <Button size="sm" className="mt-3">Optimize</Button>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="font-medium">Underutilized Make operations</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      5 Make operations have run less than 3 times this month
                    </p>
                    <Button size="sm" className="mt-3">Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Integrations */}
            <IntegrationsList integrations={integrations} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
