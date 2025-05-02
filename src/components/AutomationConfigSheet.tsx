
import { useState } from "react";
import { Automation } from "./AutomationCard";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Code, LayoutGrid, Repeat, Settings } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface AutomationConfigSheetProps {
  automation: Automation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedAutomation: Automation) => void;
}

const AutomationConfigSheet = ({
  automation,
  open,
  onOpenChange,
  onUpdate,
}: AutomationConfigSheetProps) => {
  const [configData, setConfigData] = useState<Automation>({ ...automation });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdate(configData);
      setIsSaving(false);
      onOpenChange(false);
      
      toast("Automation updated", {
        description: "Your automation settings have been saved successfully."
      });
    }, 800);
  };

  const connectWithPlatform = (platform: Automation["platform"]) => {
    // Check if already connected
    if (configData.connectedPlatforms?.includes(platform)) {
      return toast("Already connected", {
        description: `This automation is already connected with ${platform}`
      });
    }
    
    // Add the platform to connected platforms
    const updatedPlatforms = [
      ...(configData.connectedPlatforms || []),
      platform
    ];
    
    setConfigData({
      ...configData,
      connectedPlatforms: updatedPlatforms as Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">
    });
    
    toast("Platform connected", {
      description: `Your automation is now connected with ${platform}`
    });
  };

  const disconnectPlatform = (platform: Automation["platform"]) => {
    const updatedPlatforms = (configData.connectedPlatforms || []).filter(
      p => p !== platform
    );
    
    setConfigData({
      ...configData,
      connectedPlatforms: updatedPlatforms as Array<"Zapier" | "Make" | "HubSpot" | "Stripe" | "Airtable" | "Gmail">
    });
    
    toast("Platform disconnected", {
      description: `Your automation is no longer connected with ${platform}`
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Configure Automation
          </SheetTitle>
          <SheetDescription>
            Customize your automation settings and connections.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="automation-name">Automation Name</Label>
                  <Input 
                    id="automation-name" 
                    value={configData.name}
                    onChange={(e) => setConfigData({...configData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="automation-description">Description</Label>
                  <Input 
                    id="automation-description" 
                    value={configData.description}
                    onChange={(e) => setConfigData({...configData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="automation-platform">Primary Platform</Label>
                  <Select 
                    defaultValue={configData.platform}
                    onValueChange={(value) => setConfigData({
                      ...configData, 
                      platform: value as Automation["platform"]
                    })}
                  >
                    <SelectTrigger id="automation-platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zapier">Zapier</SelectItem>
                      <SelectItem value="Make">Make</SelectItem>
                      <SelectItem value="HubSpot">HubSpot</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                      <SelectItem value="Airtable">Airtable</SelectItem>
                      <SelectItem value="Gmail">Gmail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="automation-status">Activation Status</Label>
                    <Switch
                      id="automation-status"
                      checked={configData.status === "active"}
                      onCheckedChange={(checked) => 
                        setConfigData({
                          ...configData, 
                          status: checked ? "active" : "paused"
                        })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {configData.status === "active" 
                      ? "This automation is currently active and will run as scheduled." 
                      : "This automation is currently paused and won't run until activated."
                    }
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label>Schedule Type</Label>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Trigger Only</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trigger Time</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <Select defaultValue="UTC">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="local">Local Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="retry-failed" defaultChecked />
                  <Label htmlFor="retry-failed">Retry failed runs automatically</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Connected Platforms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(configData.connectedPlatforms || []).map(platform => (
                    <div 
                      key={platform} 
                      className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"
                    >
                      <span>{platform}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => disconnectPlatform(platform as Automation["platform"])}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Add Connection</h3>
                  <Select
                    onValueChange={(value) => 
                      connectWithPlatform(value as Automation["platform"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zapier">Zapier</SelectItem>
                      <SelectItem value="Make">Make</SelectItem>
                      <SelectItem value="HubSpot">HubSpot</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                      <SelectItem value="Airtable">Airtable</SelectItem>
                      <SelectItem value="Gmail">Gmail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AutomationConfigSheet;
