import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AutoWithdrawalBanner = () => {
  const { toast } = useToast();
  const [isAutoTransferEnabled, setIsAutoTransferEnabled] = useState(true);

  const handleToggleAutoTransfer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("profiles")
        .update({ auto_transfer: !isAutoTransferEnabled })
        .eq("id", user.id);

      if (error) throw error;

      setIsAutoTransferEnabled(!isAutoTransferEnabled);
      toast({
        title: "Succès",
        description: isAutoTransferEnabled 
          ? "Les retraits automatiques ont été désactivés"
          : "Les retraits automatiques ont été activés",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les retraits automatiques",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${isAutoTransferEnabled ? 'text-green-600' : 'text-blue-600'}`}>
            {isAutoTransferEnabled 
              ? "Mode retrait automatique activé"
              : "Mode retrait automatique est désactivé"}
          </h3>
          <Dialog>
            <DialogTrigger>
              <Info className="h-4 w-4 text-blue-500 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Retraits Automatiques</DialogTitle>
                <DialogDescription>
                  Le mode retrait automatique permet de transférer automatiquement vos fonds vers votre compte Mobile Money dès qu'un paiement est reçu. Cela vous évite d'avoir à faire des demandes de retrait manuelles.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <Button 
          variant="outline" 
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={handleToggleAutoTransfer}
        >
          {isAutoTransferEnabled 
            ? "Cliquer pour Désactiver"
            : "Cliquer pour Activer"}
        </Button>
      </div>
    </div>
  );
};

export default AutoWithdrawalBanner;