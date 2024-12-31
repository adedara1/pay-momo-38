import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalConfirmationProps {
  amount: string;
  onBack: () => void;
  onEdit: () => void;
  userProfile: any;
}

const WithdrawalConfirmation = ({ amount, onBack, onEdit, userProfile }: WithdrawalConfirmationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("payouts")
        .insert({
          user_id: user.id,
          amount: parseInt(amount),
          description: "Retrait de fonds",
          customer_email: userProfile.withdrawal_email,
          customer_first_name: userProfile.withdrawal_first_name,
          customer_last_name: userProfile.withdrawal_last_name,
          customer_phone: userProfile.momo_number,
          method: userProfile.momo_provider,
          currency: "XOF",
        });

      if (error) throw error;

      toast({
        title: "Demande de retrait créée",
        description: "Votre demande de retrait a été créée avec succès",
      });

      onBack();
    } catch (error) {
      console.error("Erreur lors de la création du retrait:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du retrait",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-xl font-semibold">Confirmation des Données</h2>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Montant du retrait</p>
            <p className="font-medium">{parseInt(amount).toLocaleString()} FCFA</p>
          </div>
          
          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Méthode de paiement</p>
            <p className="font-medium">{userProfile.momo_provider}</p>
          </div>

          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Numéro de téléphone</p>
            <p className="font-medium">{userProfile.momo_number}</p>
          </div>

          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="font-medium">{userProfile.withdrawal_first_name} {userProfile.withdrawal_last_name}</p>
          </div>

          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{userProfile.withdrawal_email}</p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Traitement..." : "Valider"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WithdrawalConfirmation;