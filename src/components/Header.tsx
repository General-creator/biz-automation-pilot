
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Settings, 
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const location = useLocation();
  
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
        </div>
      </div>
    </header>
  );
};

export default Header;
