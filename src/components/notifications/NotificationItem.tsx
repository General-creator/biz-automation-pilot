
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Notification } from "./types";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({ notification, onDismiss }: NotificationItemProps) => {
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

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDismiss(notification.id)}
        >
          Got it
        </Button>
      </div>
    </div>
  );
};

export default NotificationItem;
