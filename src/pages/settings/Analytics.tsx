
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Analytics = () => {
  const { user } = useAuth();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!user) return [];
      
      // Get activity data grouped by date and status
      const { data, error } = await supabase
        .from("activities")
        .select("timestamp, status")
        .eq("user_id", user.id)
        .gte("timestamp", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) {
        toast("Failed to load analytics data", {
          description: error.message,
        });
        throw error;
      }
      
      // Process data for chart
      const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, success: 0, failure: 0 };
        }
        if (item.status === "success") {
          acc[date].success += 1;
        } else {
          acc[date].failure += 1;
        }
        return acc;
      }, {});
      
      return Object.values(groupedData);
    },
    enabled: !!user
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Analytics</h1>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Automation Performance (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : analyticsData && analyticsData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="success" fill="#10b981" name="Successful Runs" />
                        <Bar dataKey="failure" fill="#ef4444" name="Failed Runs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground">No analytics data available</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analytics will appear once your automations start running
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
