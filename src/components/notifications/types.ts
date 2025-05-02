
export interface Notification {
  id: string;
  automationName: string;
  message: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
  automationId?: string;
}
