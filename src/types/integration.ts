
export interface Integration {
  id: string;
  name: string;
  logo?: string;
  isConnected: boolean;
  automationCount: number;
  category: string;
  type: string;
  status: string;
}
