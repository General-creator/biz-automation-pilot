
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectionHelpAlertProps {
  authType: "api_key" | "oauth";
}

const ConnectionHelpAlert = ({ authType }: ConnectionHelpAlertProps) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {authType === "api_key" 
          ? "Enter the API credentials required to connect to this integration." 
          : "Enter the OAuth client credentials for this integration."}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionHelpAlert;
