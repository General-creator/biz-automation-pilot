
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";
import { IntegrationFormValues } from "./forms/integration-form-types";
import IntegrationTypeSelect from "./forms/IntegrationTypeSelect";
import IntegrationNameInput from "./forms/IntegrationNameInput";
import AuthTypeTabs from "./forms/AuthTypeTabs";
import IntegrationDocumentation from "./forms/IntegrationDocumentation";
import ConnectionHelpAlert from "./forms/ConnectionHelpAlert";
import IntegrationFormActions from "./forms/IntegrationFormActions";
import { Integration } from "@/types/integration";
import { useIntegrationForm } from "@/hooks/useIntegrationForm";
import AuthenticationFields from "./forms/AuthenticationFields";

interface IntegrationConnectFormProps {
  isOpen: boolean;
  onClose: () => void;
  reconnectIntegration?: Integration | null;
}

const IntegrationConnectForm = ({ 
  isOpen, 
  onClose, 
  reconnectIntegration 
}: IntegrationConnectFormProps) => {
  const { user } = useAuth();
  
  const { 
    form, 
    authType, 
    setAuthType, 
    integrationInfo, 
    onSubmit, 
    isReconnecting,
    isPending
  } = useIntegrationForm({
    isOpen,
    onClose,
    reconnectIntegration,
    userId: user?.id || null
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={open => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isReconnecting ? "Reconnect Integration" : "Connect Integration"}</DialogTitle>
          <DialogDescription>
            {isReconnecting 
              ? "Update your credentials to reconnect this integration."
              : "Set up a connection with an external service."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <IntegrationTypeSelect 
              control={form.control} 
              disabled={isReconnecting}
            />
            <IntegrationNameInput 
              control={form.control} 
              disabled={isReconnecting}
            />
            <AuthTypeTabs 
              control={form.control} 
              authType={authType} 
              setAuthType={setAuthType}
            />
            
            <AuthenticationFields 
              control={form.control} 
              authType={authType} 
            />
            
            {integrationInfo?.documentation && (
              <IntegrationDocumentation 
                integrationType={form.watch("integrationType")} 
                documentationUrl={integrationInfo.documentation} 
              />
            )}
            
            <ConnectionHelpAlert authType={authType} />
            
            <IntegrationFormActions
              onCancel={onClose}
              isPending={isPending}
              isReconnecting={isReconnecting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConnectForm;
