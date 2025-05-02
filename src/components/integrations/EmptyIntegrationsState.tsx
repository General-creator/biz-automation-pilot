
import { Button } from "@/components/ui/button";

interface EmptyIntegrationsStateProps {
  onConnectClick: () => void;
}

const EmptyIntegrationsState = ({ onConnectClick }: EmptyIntegrationsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">No integrations connected yet</p>
      <Button variant="outline" className="mt-4" onClick={onConnectClick}>
        Connect Your First Integration
      </Button>
    </div>
  );
};

export default EmptyIntegrationsState;
