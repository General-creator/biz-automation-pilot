
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { toast } from "sonner";

export interface ActivityItem {
  id: string;
  automationName: string;
  platform: string;
  status: "success" | "failure";
  timestamp: string;
  message: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

const ActivityLog = ({ activities }: ActivityLogProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {activities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
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
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
