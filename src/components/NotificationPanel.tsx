
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  automationName: string;
  message: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

interface NotificationPanelProps {
  notifications: Notification[];
}

const NotificationPanel = ({ notifications }: NotificationPanelProps) => {
  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Low
          </Badge>
        );
    }
  };
  
  const handleDismiss = (id: string) => {
    toast("Notification dismissed", {
      description: "The notification has been removed from your list.",
    });
  };
  
  const handleFixIssue = (notification: Notification) => {
    toast("Attempting to fix issue", {
      description: `Working on resolving issue with ${notification.automationName}.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        {notifications.length > 0 && (
          <Badge className="bg-destructive">{notifications.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-3">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No alerts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Notifications about your automations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{notification.automationName}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {notification.timestamp}
                    </div>
                  </div>
                  <div>{getSeverityBadge(notification.severity)}</div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                  <Button size="sm">Fix Issue</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
