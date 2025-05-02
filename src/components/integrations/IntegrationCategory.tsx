
import { Integration } from "@/types/integration";
import IntegrationItem from "./IntegrationItem";

interface IntegrationCategoryProps {
  category: string;
  integrations: Integration[];
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  isLoading: boolean;
}

const IntegrationCategory = ({ 
  category, 
  integrations,
  onDisconnect,
  onReconnect,
  isLoading
}: IntegrationCategoryProps) => {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h3>
      <div className="space-y-2">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.id}
            integration={integration}
            onDisconnect={onDisconnect}
            onReconnect={onReconnect}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationCategory;
