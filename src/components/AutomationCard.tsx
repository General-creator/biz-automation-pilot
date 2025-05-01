
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Circle, CircleCheck, CirclePlay, CircleX, Clock, Play, Settings, Pause } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface Automation {
  id: string;
  name: string;
  description: string;
  platform: "Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail";
  status: "active" | "paused" | "failed";
  lastRun: string;
  nextRun?: string;
  runsToday: number;
  failedRuns: number;
}

interface AutomationCardProps {
  automation: Automation;
}

const AutomationCard = ({ automation }: AutomationCardProps) => {
  const [status, setStatus] = useState<"active" | "paused" | "failed">(automation.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStatus = status === "active" ? "paused" : "active";
      setStatus(newStatus);
      toast(
        newStatus === "active" ? "Automation activated" : "Automation paused", 
        { description: `${automation.name} has been ${newStatus === "active" ? "activated" : "paused"}.` }
      );
      setIsLoading(false);
    }, 500);
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
              <span className="text-muted-foreground">Last run: {automation.lastRun}</span>
            </div>
            {automation.nextRun && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Next run: {automation.nextRun}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-end">
              <span className="text-xs bg-secondary px-2 py-0.5 rounded">Runs today: {automation.runsToday}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className={`text-xs px-2 py-0.5 rounded ${automation.failedRuns > 0 ? 'bg-destructive/10 text-destructive' : 'bg-secondary'}`}>
                Failed runs: {automation.failedRuns}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <Button 
            variant={status === "active" ? "outline" : "default"} 
            size="sm"
            disabled={status === "failed"}
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
  );
};

export default AutomationCard;
