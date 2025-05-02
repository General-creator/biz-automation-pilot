import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NotificationItem from "./notifications/NotificationItem";
import EmptyNotificationState from "./notifications/EmptyNotificationState";
import { useNotifications } from "./notifications/useNotifications";
import { Notification } from "./notifications/types";

interface NotificationPanelProps {
  notifications?: Notification[];
}

const NotificationPanel = ({ notifications: initialNotifications }: NotificationPanelProps) => {
  const { notifications, handleDismiss } = useNotifications(initialNotifications);

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
          <EmptyNotificationState />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;

// Make sure to update imports in any file that uses NotificationPanel
// to use the new type from "./notifications/types" instead of direct import
export { type Notification } from "./notifications/types";
