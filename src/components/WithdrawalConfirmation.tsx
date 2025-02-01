import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WithdrawalInfoStep } from "./profile/WithdrawalInfoStep";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WithdrawalConfirmationProps {
  amount: string;
  description: string;
  onBack: () => void;
  onEdit: () => void;
  withdrawalInfo: any;
}

const WithdrawalConfirmation = ({ amount, description, onBack, onEdit, withdrawalInfo }: WithdrawalConfirmationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      // Créer d'abord la demande de retrait dans la base de données
      const { data: payout, error: payoutError } = await supabase
        .from("payouts")
        .insert({
          user_id: user.id,
          amount: parseInt(amount),
          description: description,
          customer_email: withdrawalInfo.beneficiary_email,
          customer_first_name: withdrawalInfo.beneficiary_first_name,
          customer_last_name: withdrawalInfo.beneficiary_last_name,
          customer_phone: withdrawalInfo.momo_number,
          method: withdrawalInfo.momo_provider,
          currency: "XOF",
        })
        .select()
        .single();

      if (payoutError) throw payoutError;

      // Initier le paiement via l'API Moneroo
      const { data: monerooResponse, error: monerooError } = await supabase.functions.invoke('initiate-payout', {
        body: {
          payoutId: payout.id,
          amount: parseInt(amount),
          currency: "XOF",
          description: description,
          recipient: {
            firstName: withdrawalInfo.beneficiary_first_name,
            lastName: withdrawalInfo.beneficiary_last_name,
            email: withdrawalInfo.beneficiary_email,
            phone: withdrawalInfo.momo_number,
            provider: withdrawalInfo.momo_provider,
          }
        }
      });

      if (monerooError) throw monerooError;

      // Mettre à jour le payout avec l'ID Moneroo
      if (monerooResponse?.payoutId) {
        const { error: updateError } = await supabase
          .from("payouts")
          .update({ moneroo_payout_id: monerooResponse.payoutId })
          .eq('id', payout.id);

        if (updateError) throw updateError;
      }

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

  const handleEditSave = async (updatedData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('withdrawal_info')
        .upsert({
          user_id: user.id,
          momo_provider: updatedData.momo_provider,
          momo_number: updatedData.momo_number,
          beneficiary_first_name: updatedData.first_name,
          beneficiary_last_name: updatedData.last_name,
          beneficiary_email: updatedData.company_email,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Modifications enregistrées",
        description: "Vos informations ont été mises à jour avec succès",
      });

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <ScrollArea className="h-[calc(100vh-200px)]">
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
              <p className="font-medium">{parseInt(amount).toLocaleString()} XOF</p>
            </div>

            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{description}</p>
            </div>
            
            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Méthode de paiement</p>
              <p className="font-medium">{withdrawalInfo?.momo_provider}</p>
            </div>

            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Numéro de téléphone</p>
              <p className="font-medium">{withdrawalInfo?.momo_number}</p>
            </div>

            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{withdrawalInfo?.beneficiary_first_name} {withdrawalInfo?.beneficiary_last_name}</p>
            </div>

            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{withdrawalInfo?.beneficiary_email}</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Valider"}
            </Button>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations de retrait</DialogTitle>
          </DialogHeader>
          <WithdrawalInfoStep
            momoProvider={withdrawalInfo?.momo_provider}
            momoNumber={withdrawalInfo?.momo_number}
            autoTransfer={false}
            withdrawalFirstName={withdrawalInfo?.beneficiary_first_name}
            withdrawalLastName={withdrawalInfo?.beneficiary_last_name}
            withdrawalEmail={withdrawalInfo?.beneficiary_email}
            onSave={handleEditSave}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WithdrawalConfirmation;