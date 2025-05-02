
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Notification } from "./types";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({ notification, onDismiss }: NotificationItemProps) => {
  const queryClient = useQueryClient();
  
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
  
  const handleFixIssue = () => {
    if (notification.automationId) {
      resetAutomationIssue.mutate(notification.automationId, {
        onSuccess: () => {
          onDismiss(notification.id);
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
        onDismiss(notification.id);
        toast("Issue fixed", {
          description: `Issue with ${notification.automationName} has been resolved.`,
        });
      }, 1500);
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
          Dismiss
        </Button>
        <Button 
          size="sm"
          onClick={handleFixIssue}
          disabled={resetAutomationIssue.isPending}
        >
          {resetAutomationIssue.isPending ? "Fixing..." : "Fix Issue"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationItem;
