import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ApprovalBanner = () => {
  return (
    <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 rounded-none">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="ml-2">
        Votre compte est en attente d'approbation. L'approbation se fait généralement sous 24h. Vous serez notifié par email une fois votre compte approuvé.
      </AlertDescription>
    </Alert>
  );
};

export default ApprovalBanner;