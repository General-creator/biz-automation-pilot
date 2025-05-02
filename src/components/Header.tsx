
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
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
