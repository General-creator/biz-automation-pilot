
import { z } from "zod";

// Form validation schema
export const integrationFormSchema = z.object({
  integrationName: z.string().min(1, "Integration name is required"),
  integrationType: z.string().min(1, "Integration type is required"),
  authType: z.enum(["api_key", "oauth"]),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional()
});

export type IntegrationFormValues = z.infer<typeof integrationFormSchema>;

export interface IntegrationInfo {
  fields: string[];
  documentation: string;
}
