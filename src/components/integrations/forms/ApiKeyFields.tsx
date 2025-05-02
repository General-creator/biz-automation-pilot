
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { IntegrationFormValues } from "./integration-form-types";

interface ApiKeyFieldsProps {
  control: Control<IntegrationFormValues>;
}

const ApiKeyFields = ({ control }: ApiKeyFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default ApiKeyFields;
