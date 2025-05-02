
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface IntegrationDocumentationProps {
  integrationType?: string;
  documentationUrl?: string;
}

const IntegrationDocumentation = ({ integrationType, documentationUrl }: IntegrationDocumentationProps) => {
  if (!documentationUrl) return null;
  
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{integrationType}</Badge>
            <span className="text-xs text-muted-foreground">Documentation</span>
          </div>
          <a 
            href={documentationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center text-primary hover:underline"
          >
            View docs <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationDocumentation;
