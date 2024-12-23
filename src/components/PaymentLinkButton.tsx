import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";
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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPayNow, setShowPayNow] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddToCart = async () => {
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
      console.log("Creating payment link for product:", product);

      const { data: paymentResponse, error } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: product.amount,
            description: product.description,
            payment_type: "simple"
          }
        }
      );

      if (error) {
        console.error("Payment link creation error:", error);
        throw error;
      }

      console.log("Payment link created:", paymentResponse);
      
      setPaymentUrl(paymentResponse.payment_url);
      setShowPayNow(true);

      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté au panier et le lien de paiement est prêt",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout au panier",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        onClick={handleAddToCart}
        disabled={isProcessing || showPayNow}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isProcessing ? "Traitement..." : "Ajouter au panier"}
      </Button>

      {showPayNow && (
        <div className="space-y-2">
          <Button 
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            onClick={handlePayNow}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Payer maintenant
          </Button>
          {paymentUrl && (
            <div className="text-sm text-gray-600 break-all">
              Lien de paiement: <a href={paymentUrl} className="text-blue-600 hover:underline">{paymentUrl}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentLinkButton;