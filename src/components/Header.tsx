
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define notification type
interface Notification {
  id: string;
  automationName: string;
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

const Header = () => {
  const { user, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Just one welcome notification
  const welcomeNotification: Notification = {
    id: "welcome",
    automationName: "Automator",
    message: "Welcome to Automator! Get started by exploring our features.",
    timestamp: new Date().toLocaleString(),
    severity: "low" as const
  };
  
  const [notifications, setNotifications] = useState<Notification[]>([welcomeNotification]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span className="font-bold">Automator</span>
            </Link>
            <Link
              to="/dashboard"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/automations"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Agents
            </Link>
            <Link
              to="/settings"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="hidden font-bold md:inline-block">Automator</span>
        </Link>
      </div>
      <nav className="hidden flex-1 items-center gap-6 md:flex">
        <Link
          to="/dashboard"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Dashboard
        </Link>
        <Link
          to="/automations"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Agents
        </Link>
        <Link
          to="/settings"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Settings
        </Link>
      </nav>
      <div className="flex flex-1 items-center justify-end gap-4">
        <DropdownMenu
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {notifications.length}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer p-0"
                  >
                    <div className="flex w-full flex-col gap-1 p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {notification.automationName}
                        </span>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(notification.severity)}
                        >
                          {notification.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          Got it
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || ""}
                  alt={user?.email || "User"}
                />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/integrations">Integrations</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
