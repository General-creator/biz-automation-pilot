
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip } from "recharts";
import { ChartLine, ChartBar, DollarSign } from "lucide-react";

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
    theme: { light: "#60a5fa", dark: "#3b82f6" },
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

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your automation metrics and performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Monthly Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ChartLine className="h-5 w-5 text-primary" />
                  <span>Monthly Cost</span>
                </div>
                <span className="text-lg font-normal text-muted-foreground">$1,890</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer config={costConfig} className="h-72">
                <LineChart data={costData} margin={{ top: 20, right: 20, bottom: 20, left: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    width={40}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    cursor={{ stroke: '#ddd', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#60a5fa" 
                    strokeWidth={3} 
                    dot={{ stroke: '#60a5fa', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Execution Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-primary" />
                <span>Weekly Execution Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer config={runConfig} className="h-72">
                <BarChart 
                  data={runData} 
                  margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                  barGap={0}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    scale="point" 
                    padding={{ left: 20, right: 20 }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    width={25}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="successful" 
                    fill="#10b981" 
                    stackId="stack" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="failed" 
                    fill="#ef4444" 
                    stackId="stack" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span>Cost Breakdown by Service</span>
              </CardTitle>
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
        </div>
      </main>
    </div>
  );
};

export default Analytics;
