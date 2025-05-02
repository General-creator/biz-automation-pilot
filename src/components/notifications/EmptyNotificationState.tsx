
import { AlertTriangle } from "lucide-react";

const EmptyNotificationState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="rounded-full bg-muted p-3">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No alerts</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Notifications about your automations will appear here.
      </p>
    </div>
  );
};

export default EmptyNotificationState;
