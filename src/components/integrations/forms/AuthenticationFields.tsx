
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs defaultValue={authType} className="w-full">
      <TabsList className="hidden">
        <TabsTrigger value="api_key">API Key</TabsTrigger>
        <TabsTrigger value="oauth">OAuth</TabsTrigger>
      </TabsList>
      
      <TabsContent value="api_key" className="mt-4 space-y-4">
        <ApiKeyFields control={control} />
      </TabsContent>
      
      <TabsContent value="oauth" className="mt-4 space-y-4">
        <OAuthFields control={control} />
      </TabsContent>
    </Tabs>
  );
};

export default AuthenticationFields;
