
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface IntegrationFormActionsProps {
  onCancel: () => void;
  isPending: boolean;
}

const IntegrationFormActions = ({ onCancel, isPending }: IntegrationFormActionsProps) => {
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
        {isPending ? "Connecting..." : "Connect"}
      </Button>
    </DialogFooter>
  );
};

export default IntegrationFormActions;
