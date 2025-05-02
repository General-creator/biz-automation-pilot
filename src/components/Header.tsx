
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Settings, 
  PlusCircle,
  HelpCircle,
  LogOut,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Function to handle notifications
  const handleNotificationClick = () => {
    toast("Notifications", {
      description: "Notification center coming soon!",
    });
  };

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <h1 className="text-xl font-bold">AutoPilot</h1>
          </Link>

          <div className="hidden md:flex items-center ml-6 space-x-1">
            <Link to="/dashboard">
              <Button 
                variant={location.pathname === "/dashboard" ? "default" : "ghost"} 
                className="text-sm"
              >
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="text-sm">Automations</Button>
            <Button variant="ghost" className="text-sm">Integrations</Button>
            <Button variant="ghost" className="text-sm">Analytics</Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleNotificationClick}>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Automation
          </Button>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <User className="h-4 w-4 mr-2" />
                  {user.name.split(' ')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                  <span className="text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
