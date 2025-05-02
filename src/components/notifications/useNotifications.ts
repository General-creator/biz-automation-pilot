import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Notification } from "./types";

export const useNotifications = (initialNotifications?: Notification[]) => {
  // Default to welcome notification if no initialNotifications provided
  const defaultWelcomeNotification: Notification = {
    id: "welcome-notification",
    automationName: "Automator",
    message: "Welcome to Automator! Get started by exploring our features.",
    timestamp: new Date().toLocaleString(),
    severity: "low"
  };
  
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications || [defaultWelcomeNotification]
  );
  
  // We don't need to fetch automation issues anymore since we only want welcome notifications
  const { data: automations } = useQuery({
    queryKey: ["welcome-notification"],
    queryFn: async () => {
      // If initial notifications were provided, use those
      if (initialNotifications) {
        return [];
      }
      
      // Otherwise return just the welcome notification
      setNotifications([defaultWelcomeNotification]);
      return [];
    },
    enabled: initialNotifications === undefined,
  });
  
  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast("Notification dismissed", {
      description: "The notification has been removed from your list.",
    });
  };
  
  return {
    notifications,
    automations,
    handleDismiss
  };
};
