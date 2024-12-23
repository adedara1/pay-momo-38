import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentLinkButtonProps {
  product: {
    id: string;
    amount: number;
    description: string;
  };
}

const PaymentLinkButton = ({ product }: PaymentLinkButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDirectPayment = async () => {
    try {
      setIsProcessing(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }

      console.log("Initiating direct payment for product:", product);

      const { data: paymentResponse, error } = await supabase.functions.invoke(
        "direct-payment",
        {
          body: {
            amount: product.amount,
            description: product.description,
            customer_email: session.user.email
          }
        }
      );

      if (error) {
        console.error("Payment error:", error);
        throw error;
      }

      console.log("Payment initiated:", paymentResponse);

      toast({
        title: "Paiement initié",
        description: "Vous allez être redirigé vers la page de paiement",
      });

      // Rediriger vers l'URL de paiement si fournie par PayDunya
      if (paymentResponse.redirect_url) {
        window.location.href = paymentResponse.redirect_url;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        onClick={handleDirectPayment}
        disabled={isProcessing}
      >
        <CreditCard className="mr-2 h-5 w-5" />
        {isProcessing ? "Traitement..." : `Payer ${product.amount} FCFA`}
      </Button>
    </div>
  );
};

export default PaymentLinkButton;