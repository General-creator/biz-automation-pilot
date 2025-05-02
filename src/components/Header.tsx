
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
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Header = () => {
  const { user, profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleSettingsClick = (setting: string) => {
    toast(`${setting} settings`, {
      description: `Opening ${setting.toLowerCase()} settings panel`,
    });
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <h1 className="text-xl font-bold">AutoPilot</h1>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="mr-2 hidden text-sm text-gray-600 md:block">
                Welcome, {displayName}
              </span>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSettingsClick("Account")}>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingsClick("Integrations")}>
                    <Cog className="mr-2 h-4 w-4" />
                    Integrations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingsClick("Analytics")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSettingsClick("Help")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>Connect Integration</Button>
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
    </header>
  );
};

export default Header;
