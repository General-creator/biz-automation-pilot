
import React, { useState, useEffect } from "react";
import { Automation } from "./AutomationCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface AutomationConfigSheetProps {
  automation: Automation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedAutomation: Automation) => void;
}

const AutomationConfigSheet = ({ automation, open, onOpenChange, onUpdate }: AutomationConfigSheetProps) => {
  const [formData, setFormData] = useState<Automation>({ ...automation });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form data when the automation changes
  useEffect(() => {
    setFormData({ ...automation });
  }, [automation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (value: string) => {
    setFormData(prev => ({ ...prev, platform: value as Automation["platform"] }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, status: checked ? "active" : "paused" }));
  };

  const handleSave = () => {
    setIsSubmitting(true);

    // Validate the form
    if (!formData.name.trim() || !formData.description.trim()) {
      toast("Validation Error", {
        description: "Name and description are required."
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (onUpdate) {
        onUpdate(formData);
      }
      
      setIsSubmitting(false);
      onOpenChange(false);
      
      toast("Automation Updated", {
        description: `${formData.name} has been successfully updated.`
      });
    }, 500);
  };

  const availablePlatforms = ["Zapier", "Make", "HubSpot", "Stripe", "Airtable", "Gmail"] as const;

  const handleConnectPlatform = (platform: typeof availablePlatforms[number]) => {
    if (!formData.connectedPlatforms?.includes(platform)) {
      const updatedPlatforms = [...(formData.connectedPlatforms || []), platform];
      setFormData(prev => ({ ...prev, connectedPlatforms: updatedPlatforms }));
    }
  };

  const handleDisconnectPlatform = (platform: typeof availablePlatforms[number]) => {
    const updatedPlatforms = formData.connectedPlatforms?.filter(p => p !== platform) || [];
    setFormData(prev => ({ ...prev, connectedPlatforms: updatedPlatforms }));
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Configure Automation</SheetTitle>
          <SheetDescription>
            Update your automation settings and connections
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Automation Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter automation name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Describe what this automation does"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="platform">Primary Platform</Label>
            <Select 
              value={formData.platform} 
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {formData.status === "active" ? "Active" : formData.status === "paused" ? "Paused" : "Failed"}
              </span>
              <Switch 
                checked={formData.status === "active"} 
                onCheckedChange={handleStatusChange}
                disabled={formData.status === "failed"}
              />
            </div>
          </div>
          
          <div className="grid gap-2 pt-4">
            <Label>Connected Platforms</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.connectedPlatforms && formData.connectedPlatforms.map((platform) => (
                <Badge key={platform} className="gap-1 px-3 py-1">
                  {platform}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1" 
                    onClick={() => handleDisconnectPlatform(platform)}
                  />
                </Badge>
              ))}
            </div>
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Add connections:
              </Label>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.filter(platform => 
                  !formData.connectedPlatforms?.includes(platform) && platform !== formData.platform
                ).map((platform) => (
                  <Button 
                    key={platform} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleConnectPlatform(platform)}
                  >
                    <Plus className="h-3 w-3" />
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AutomationConfigSheet;
