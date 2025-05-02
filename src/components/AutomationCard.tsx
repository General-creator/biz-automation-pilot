
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Circle, CircleCheck, CirclePlay, CircleX, Clock, Play, Settings, Pause } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AutomationConfigSheet from "./AutomationConfigSheet";

export interface Automation {
  id: string;
  name: string;
  description: string;
  platform: "Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail";
  connectedPlatforms?: Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">;
  status: "active" | "paused" | "failed";
  last_run: string;
  next_run?: string;
  runs_today: number;
  failed_runs: number;
}

interface AutomationCardProps {
  automation: Automation;
  onConfigure?: (id: string) => void;
  onUpdate?: (automation: Automation) => void;
}

const AutomationCard = ({ automation, onConfigure, onUpdate }: AutomationCardProps) => {
  const [status, setStatus] = useState<"active" | "paused" | "failed">(automation.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const queryClient = useQueryClient();

  // Toggle automation status (active/paused)
  const handleToggle = () => {
    if (isLoading || status === "failed") return;
    
    setIsLoading(true);
    const newStatus = status === "active" ? "paused" : "active";
    
    // Optimistic update
    setStatus(newStatus);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      if (onUpdate) {
        const updatedAutomation: Automation = {
          ...automation,
          status: newStatus,
          last_run: new Date().toISOString()
        };
        onUpdate(updatedAutomation);
      }
      
      setIsLoading(false);
      toast(
        newStatus === "active" ? "Automation activated" : "Automation paused",
        { description: `${automation.name} has been ${newStatus === "active" ? "activated" : "paused"}.` }
      );
    }, 500);
  };

  // Run automation manually
  const handleRunNow = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      if (onUpdate) {
        const updatedAutomation: Automation = {
          ...automation,
          last_run: new Date().toISOString(),
          runs_today: automation.runs_today + 1
        };
        onUpdate(updatedAutomation);
      }
      
      setIsLoading(false);
      toast("Automation triggered", {
        description: `${automation.name} has been manually triggered.`
      });
    }, 500);
  };

  const handleConfigure = () => {
    setIsConfigOpen(true);
  };

  const handleAutomationUpdate = (updatedAutomation: Automation) => {
    if (onUpdate) {
      onUpdate(updatedAutomation);
    }
  };

  const getPlatformBadge = (platform: Automation["platform"]) => {
    const colors = {
      Zapier: "bg-orange-100 text-orange-800 border-orange-200",
      Make: "bg-purple-100 text-purple-800 border-purple-200",
      HubSpot: "bg-orange-100 text-orange-800 border-orange-200",
      Stripe: "bg-blue-100 text-blue-800 border-blue-200",
      Airtable: "bg-green-100 text-green-800 border-green-200",
      Gmail: "bg-red-100 text-red-800 border-red-200"
    };
    
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[platform]}`}>
      {platform}
    </span>;
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return <CircleCheck className="h-4 w-4 text-success" />;
      case "paused":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <CircleX className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "paused":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Paused</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-200",
        status === "active" && "border-l-4 border-l-success",
        status === "paused" && "border-l-4 border-l-warning",
        status === "failed" && "border-l-4 border-l-destructive"
      )}>
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{automation.name}</h3>
              {getPlatformBadge(automation.platform)}
            </div>
            <p className="text-sm text-muted-foreground">{automation.description}</p>
            {/* Display connected platforms if they exist */}
            {automation.connectedPlatforms && automation.connectedPlatforms.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <CirclePlay className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground mr-1">Connected with:</span>
                <div className="flex gap-1 flex-wrap">
                  {automation.connectedPlatforms.map((platform) => (
                    <span key={platform} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Switch 
              checked={status === "active"} 
              disabled={isLoading || status === "failed"} 
              onCheckedChange={handleToggle} 
            />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Last run: {new Date(automation.last_run).toLocaleString()}</span>
              </div>
              {automation.next_run && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">Next run: {new Date(automation.next_run).toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-end">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded">Runs today: {automation.runs_today}</span>
              </div>
              <div className="flex items-center justify-end">
                <span className={`text-xs px-2 py-0.5 rounded ${automation.failed_runs > 0 ? 'bg-destructive/10 text-destructive' : 'bg-secondary'}`}>
                  Failed runs: {automation.failed_runs}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleConfigure}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button 
              variant={status === "active" ? "outline" : "default"} 
              size="sm"
              disabled={status === "failed" || isLoading}
              onClick={status === "active" ? handleToggle : handleRunNow}
            >
              {status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-1" /> 
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" /> 
                  Run Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AutomationConfigSheet
        automation={automation}
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        onUpdate={handleAutomationUpdate}
      />
    </>
  );
};

export default AutomationCard;
