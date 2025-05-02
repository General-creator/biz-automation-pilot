
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  size?: "default" | "large" | "small";
}

const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className,
  iconClassName,
  size = "default",
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      size === "large" && "py-16",
      size === "small" && "py-8",
      className
    )}>
      {icon && (
        <div className={cn(
          "rounded-full bg-muted p-3 mb-4",
          size === "large" && "p-4 mb-6",
          size === "small" && "p-2 mb-3",
          iconClassName
        )}>
          {icon}
        </div>
      )}
      <h2 className={cn(
        "font-semibold",
        size === "large" && "text-2xl",
        size === "default" && "text-xl",
        size === "small" && "text-lg",
      )}>
        {title}
      </h2>
      <p className={cn(
        "mt-2 text-muted-foreground max-w-md",
        size === "small" && "text-sm"
      )}>
        {description}
      </p>
      <Button 
        onClick={onAction} 
        className={cn("mt-6", size === "small" && "mt-4")}
        size={size === "small" ? "sm" : "default"}
      >
        {actionText}
      </Button>
    </div>
  );
};

export default EmptyState;
