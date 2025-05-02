
import { KeyRound, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { IntegrationFormValues } from "./integration-form-types";

interface AuthTypeTabsProps {
  control: Control<IntegrationFormValues>;
  authType: "api_key" | "oauth";
  setAuthType: (type: "api_key" | "oauth") => void;
}

const AuthTypeTabs = ({ control, authType, setAuthType }: AuthTypeTabsProps) => {
  return (
    <FormField
      control={control}
      name="authType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Authentication Type</FormLabel>
          <Tabs 
            value={field.value} 
            onValueChange={(value) => {
              field.onChange(value);
              setAuthType(value as "api_key" | "oauth");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api_key" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                API Key
              </TabsTrigger>
              <TabsTrigger value="oauth" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                OAuth
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="api_key" className="mt-4 space-y-4">
              <FormField
                control={control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter API key" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="apiSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter API secret" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="oauth" className="mt-4 space-y-4">
              <FormField
                control={control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="clientSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Secret</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client secret" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AuthTypeTabs;
