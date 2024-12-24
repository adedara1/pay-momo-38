import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";

interface PaymentLinkButtonProps {
  product: Product | SimplePage;
}

const PaymentLinkButton = ({ product }: PaymentLinkButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPayNow, setShowPayNow] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Récupérer ou créer un ID de session pour les utilisateurs non authentifiés
    const existingSessionId = localStorage.getItem('cart_session_id');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('cart_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

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
      console.log("Adding product to cart:", product);

      // Créer le lien de paiement directement sans ajouter au panier
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: product.amount,
            description: product.description,
            payment_type: "simple"
          }
        }
      );

      if (paymentError) {
        console.error("Payment link creation error:", paymentError);
        throw paymentError;
      }

      console.log("Payment link created:", paymentResponse);
      
      setPaymentUrl(paymentResponse.payment_url);
      setShowPayNow(true);

      toast({
        title: "Lien de paiement créé",
        description: "Le lien de paiement est prêt",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lien de paiement",
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