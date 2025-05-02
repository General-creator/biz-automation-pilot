
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { IntegrationFormValues } from "./integration-form-types";

interface IntegrationNameInputProps {
  control: Control<IntegrationFormValues>;
  disabled?: boolean;
}

const IntegrationNameInput = ({ control, disabled = false }: IntegrationNameInputProps) => {
  return (
    <FormField
      control={control}
      name="integrationName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Integration Name</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., My Zapier Integration" 
              {...field} 
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IntegrationNameInput;
