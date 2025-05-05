
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ApiKeyFields from "./ApiKeyFields";
import OAuthFields from "./OAuthFields";
import { Control } from "react-hook-form";
import { IntegrationFormValues } from "./integration-form-types";

interface AuthenticationFieldsProps {
  control: Control<IntegrationFormValues>;
  authType: "api_key" | "oauth";
}

const AuthenticationFields = ({ control, authType }: AuthenticationFieldsProps) => {
  return (
    <Tabs value={authType} className="w-full">
      {authType === "api_key" && (
        <TabsContent value="api_key" className="mt-4 space-y-4">
          <ApiKeyFields control={control} />
        </TabsContent>
      )}
      
      {authType === "oauth" && (
        <TabsContent value="oauth" className="mt-4 space-y-4">
          <OAuthFields control={control} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AuthenticationFields;
