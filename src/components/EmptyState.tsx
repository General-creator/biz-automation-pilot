
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="rounded-full bg-muted p-3 mb-4">{icon}</div>}
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground max-w-md">{description}</p>
      <Button onClick={onAction} className="mt-6">
        {actionText}
      </Button>
    </div>
  );
};

export default EmptyState;
