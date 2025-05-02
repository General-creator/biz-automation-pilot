
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

const Header = () => {
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
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button>Connect Integration</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
