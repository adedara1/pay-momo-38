import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SimplePaymentButtonProps {
  product: {
    id: string;
    amount: number;
    description: string;
  };
}

const SimplePaymentButton = ({ product }: SimplePaymentButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDirectPayment = async () => {
    try {
      if (product.amount < 200) {
        toast({
          title: "Montant invalide",
          description: "Le montant minimum est de 200 FCFA",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      console.log("Creating direct payment for product:", product);

      // Créer le lien de paiement direct avec Moneroo
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: product.amount,
            description: product.description,
            payment_type: "direct"
          }
        }
      );

      if (paymentError) {
        console.error("Payment link creation error:", paymentError);
        throw paymentError;
      }

      console.log("Payment link created:", paymentResponse);

      // Rediriger vers la page de paiement Moneroo
      window.location.href = paymentResponse.payment_url;

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      size="lg"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
      onClick={handleDirectPayment}
      disabled={isProcessing}
    >
      <CreditCard className="mr-2 h-5 w-5" />
      {isProcessing ? "Traitement..." : "Payer maintenant"}
    </Button>
  );
};

export default SimplePaymentButton;