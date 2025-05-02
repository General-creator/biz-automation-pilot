
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus,
  User,
  Cog,
  HelpCircle,
  BarChart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/components/NotificationPanel";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    apiKey: "",
  });
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from automations with issues
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("user_id", user.id)
        .or("failed_runs.gt.0");
      
      if (error) {
        toast("Failed to load notifications", {
          description: error.message,
        });
        throw error;
      }
      
      // Generate notifications from automations with issues
      if (data && data.length > 0) {
        return data.map(automation => ({
          id: `notification-${automation.id}`,
          automationId: automation.id,
          automationName: automation.name,
          message: automation.failed_runs > 0 
            ? `${automation.failed_runs} consecutive failures detected`
            : "Issue detected with this automation",
          timestamp: new Date(automation.updated_at || Date.now()).toLocaleString(),
          severity: automation.failed_runs > 3 ? "high" : "medium"
        }));
      }
      
      return [];
    },
    enabled: !!user,
  });

  // Update notifications when data changes
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const handleLogout = async () => {
    await logout();
  };

  const handleSettingsNavigation = (path: string, setting: string) => {
    toast(`Navigating to ${setting}`, {
      description: `Opening ${setting.toLowerCase()} settings page`,
    });
    navigate(path);
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
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
        onError: (error: Error) => {
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

  // Create new integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: { name: string; type: string; apiKey: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase.from("integrations").insert({
        user_id: user.id,
        name: integration.name,
        type: integration.type,
        api_key: integration.apiKey,
        status: "connected",
      }).select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      setIsDialogOpen(false);
      setNewIntegration({ name: "", type: "", apiKey: "" });
      toast("Integration connected", {
        description: "Your new integration has been successfully connected.",
      });
    },
    onError: (error) => {
      toast("Failed to connect integration", {
        description: error.message,
      });
    }
  });

  const handleSaveIntegration = () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast("Please fill in all required fields", {
        description: "Integration name and type are required.",
      });
      return;
    }

    createIntegrationMutation.mutate(newIntegration);
  };

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <h1 className="text-xl font-bold">AutoPilot</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="mr-2 hidden text-sm text-gray-600 md:block">
                Welcome, {displayName}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-white">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    {notifications.length > 0 && (
                      <Badge className="bg-destructive">{notifications.length}</Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications at this time
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-muted">
                          <div className="mb-1 font-medium">{notification.automationName}</div>
                          <div className="mb-1 text-sm text-muted-foreground">{notification.message}</div>
                          <div className="mb-2 text-xs text-muted-foreground">{notification.timestamp}</div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleDismiss(notification.id);
                              }}
                            >
                              Dismiss
                            </Button>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleFixIssue(notification);
                              }}
                              disabled={resetAutomationIssue.isPending}
                            >
                              Fix
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSettingsNavigation("/settings/account", "Account")}>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingsNavigation("/settings/integrations", "Integrations")}>
                    <Cog className="mr-2 h-4 w-4" />
                    Integrations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingsNavigation("/settings/analytics", "Analytics")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSettingsNavigation("/settings/help", "Help")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleConnectClick}>Connect Integration</Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect New Integration</DialogTitle>
            <DialogDescription>
              Enter the details for the integration you want to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="integration-type">Integration Type</Label>
              <Select 
                value={newIntegration.type} 
                onValueChange={(value) => setNewIntegration({...newIntegration, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow Automation</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="payment">Payment Processing</SelectItem>
                  <SelectItem value="data">Data Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="integration-name">Integration Name</Label>
              <Select 
                value={newIntegration.name} 
                onValueChange={(value) => setNewIntegration({...newIntegration, name: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zapier">Zapier</SelectItem>
                  <SelectItem value="Make">Make (Integromat)</SelectItem>
                  <SelectItem value="HubSpot">HubSpot</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Airtable">Airtable</SelectItem>
                  <SelectItem value="Gmail">Gmail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={newIntegration.apiKey}
                onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveIntegration}
              disabled={createIntegrationMutation.isPending}
            >
              {createIntegrationMutation.isPending ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
