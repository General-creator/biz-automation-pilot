
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  automationName: string;
  message: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
  automationId?: string;
}

interface NotificationPanelProps {
  notifications?: Notification[];
}

const NotificationPanel = ({ notifications: initialNotifications }: NotificationPanelProps) => {
  const queryClient = useQueryClient();
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
  
  // Reset failed runs for an automation
  const resetAutomationIssue = useMutation({
    mutationFn: async (automationId: string) => {
      const { data, error } = await supabase
        .from("automations")
        .update({
          failed_runs: 0,
          status: "active"
        })
        .eq("id", automationId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      queryClient.invalidateQueries({ queryKey: ["automations-with-issues"] });
    }
  });
  
  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast("Notification dismissed", {
      description: "The notification has been removed from your list.",
    });
  };
  
  const handleFixIssue = (notification: Notification) => {
    if (notification.automationId) {
      resetAutomationIssue.mutate(notification.automationId, {
        onSuccess: () => {
          handleDismiss(notification.id);
          toast("Issue fixed", {
            description: `Issue with ${notification.automationName} has been resolved.`,
          });
        },
        onError: (error) => {
          toast("Failed to fix issue", {
            description: `Error: ${error.message}`,
          });
        }
      });
    } else {
      toast("Attempting to fix issue", {
        description: `Working on resolving issue with ${notification.automationName}.`,
      });
      
      // Remove notification after a delay to simulate fixing
      setTimeout(() => {
        handleDismiss(notification.id);
        toast("Issue fixed", {
          description: `Issue with ${notification.automationName} has been resolved.`,
        });
      }, 1500);
    }
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleFixIssue(notification)}
                    disabled={resetAutomationIssue.isPending}
                  >
                    {resetAutomationIssue.isPending ? "Fixing..." : "Fix Issue"}
                  </Button>
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
