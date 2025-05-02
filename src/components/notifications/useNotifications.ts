
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Notification } from "./types";

export const useNotifications = (initialNotifications?: Notification[]) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || []);
  
  // Fetch automations with issues to generate notifications
  const { data: automations } = useQuery({
    queryKey: ["automations-with-issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .or("failed_runs.gt.0");
      
      if (error) {
        toast("Failed to load automations with issues", {
          description: error.message,
        });
        throw error;
      }
      
      // Generate notifications from automations with issues
      if (data && data.length > 0) {
        const newNotifications: Notification[] = data.map(automation => ({
          id: `notification-${automation.id}`,
          automationId: automation.id,
          automationName: automation.name,
          message: automation.failed_runs > 0 
            ? `${automation.failed_runs} consecutive failures detected`
            : "Issue detected with this automation",
          timestamp: new Date(automation.updated_at || Date.now()).toLocaleString(),
          severity: automation.failed_runs > 3 ? "high" : "medium"
        }));
        
        setNotifications(newNotifications);
        return data;
      }
      
      return data || [];
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
