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
    payment_links?: {
      paydunya_token: string | null;
    };
  };
}

const PaymentLinkButton = ({ product }: PaymentLinkButtonProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getPaymentUrl = (token: string) => {
    return `https://app.sandbox.paydunya.com/sandbox-checkout/invoice/${token}`;
  };

  const handleCreatePaymentLink = async () => {
    try {
      setIsCreating(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }

      console.log("Creating payment link for product:", product);

      const { data: paymentLink, error: createError } = await supabase
        .from('payment_links')
        .insert({
          amount: product.amount,
          description: product.description,
          payment_type: 'product',
          user_id: session.user.id
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating payment link:", createError);
        throw createError;
      }

      console.log("Payment link created:", paymentLink);

      const { error: updateError } = await supabase
        .from('products')
        .update({ payment_link_id: paymentLink.id })
        .eq('id', product.id);

      if (updateError) {
        console.error("Error updating product:", updateError);
        throw updateError;
      }

      toast({
        title: "Lien de paiement créé",
        description: "Le lien de paiement a été créé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (paymentLink.paydunya_token) {
        window.location.href = getPaymentUrl(paymentLink.paydunya_token);
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lien",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      {product.payment_links?.paydunya_token ? (
        <Button 
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={() => window.location.href = getPaymentUrl(product.payment_links.paydunya_token!)}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Payer {product.amount} FCFA
        </Button>
      ) : (
        <Button 
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={handleCreatePaymentLink}
          disabled={isCreating}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {isCreating ? "Initialisation..." : `Payer ${product.amount} FCFA`}
        </Button>
      )}
    </div>
  );
};

export default PaymentLinkButton;