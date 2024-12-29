import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WithdrawalDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Exemple de données utilisateur
  const demoData = {
    amount: 50000,
    description: "Retrait de test",
    customer: {
      email: "demo@example.com",
      first_name: "John",
      last_name: "Doe",
      phone: "+22501234567"
    },
    method: "mtn_ci"
  };

  const handleDemoTransfer = async () => {
    setIsLoading(true);
    try {
      console.log("Initiating demo transfer with data:", demoData);

      const { data: payoutData, error: payoutError } = await supabase.functions.invoke(
        "create-payout",
        {
          body: {
            amount: demoData.amount,
            currency: "XOF",
            description: demoData.description,
            customer: demoData.customer,
            method: demoData.method,
            metadata: {
              demo: true,
              initiated_at: new Date().toISOString()
            }
          }
        }
      );

      if (payoutError) throw payoutError;

      console.log("Transfer initiated successfully:", payoutData);
      
      toast({
        title: "Transfert initié",
        description: `Transfert de ${demoData.amount} XOF initié vers ${demoData.customer.phone}`,
      });

    } catch (error) {
      console.error("Error initiating transfer:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initiation du transfert",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Démo de Transfert</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Montant: {demoData.amount} XOF</p>
          <p className="text-sm text-gray-600">Description: {demoData.description}</p>
          <p className="text-sm text-gray-600">Bénéficiaire: {demoData.customer.first_name} {demoData.customer.last_name}</p>
          <p className="text-sm text-gray-600">Téléphone: {demoData.customer.phone}</p>
          <p className="text-sm text-gray-600">Méthode: {demoData.method}</p>
        </div>

        <Button 
          onClick={handleDemoTransfer} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Traitement..." : "Initier le transfert de démo"}
        </Button>
      </div>
    </Card>
  );
};

export default WithdrawalDemo;