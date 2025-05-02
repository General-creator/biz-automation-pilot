
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { IntegrationFormValues } from "./integration-form-types";

interface IntegrationTypeSelectProps {
  control: Control<IntegrationFormValues>;
}

const IntegrationTypeSelect = ({ control }: IntegrationTypeSelectProps) => {
  return (
    <FormField
      control={control}
      name="integrationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Integration Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select integration type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IntegrationTypeSelect;
