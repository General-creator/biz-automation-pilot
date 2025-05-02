
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface IntegrationFormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isReconnecting?: boolean;
}

const IntegrationFormActions = ({ 
  onCancel, 
  isPending, 
  isReconnecting = false 
}: IntegrationFormActionsProps) => {
  return (
    <DialogFooter className="pt-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isPending}
      >
        {isPending 
          ? isReconnecting ? "Reconnecting..." : "Connecting..." 
          : isReconnecting ? "Reconnect" : "Connect"
        }
      </Button>
    </DialogFooter>
  );
};

export default IntegrationFormActions;
