
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface ActivityItem {
  id: string;
  automationName: string;
  platform: string;
  status: "success" | "failure";
  timestamp: string;
  message: string;
}

const ActivityLog = () => {
  const { user } = useAuth();

  // Fetch activities from Supabase
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
      
      if (error) {
        toast("Failed to load activities", {
          description: error.message,
        });
        throw error;
      }
      
      return data.map(activity => ({
        id: activity.id,
        automationName: activity.automation_name,
        platform: activity.platform,
        status: activity.status as "success" | "failure",
        timestamp: new Date(activity.timestamp).toLocaleString(),
        message: activity.message || ""
      })) as ActivityItem[];
    },
    enabled: !!user
  });

  const getStatusIcon = (status: "success" | "failure") => {
    return status === "success" ? (
      <CircleCheck className="h-5 w-5 text-success" />
    ) : (
      <CircleX className="h-5 w-5 text-destructive" />
    );
  };
  
  const handleActivityClick = (activity: ActivityItem) => {
    toast(`${activity.automationName} details`, {
      description: activity.message,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        ) : (
          <ul className="divide-y">
            {activities.map((activity) => (
              <li 
                key={activity.id} 
                className="px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {activity.automationName}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({activity.platform})
                        </span>
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.timestamp}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
