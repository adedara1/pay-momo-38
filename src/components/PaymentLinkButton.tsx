import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
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
    return `https://paydunya.com/checkout/invoice/${token}`;
  };

  const handleCreatePaymentLink = async () => {
    try {
      setIsCreating(true);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }

      console.log("Creating payment link for product:", product);

      // Create a payment link with user_id
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

      // Update the product with the payment link id
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

      // Redirect to PayDunya payment page if token is available
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

  if (product.payment_links?.paydunya_token) {
    return (
      <a
        href={getPaymentUrl(product.payment_links.paydunya_token)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <LinkIcon className="h-4 w-4" />
        Lien de paiement
      </a>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleCreatePaymentLink}
      className="flex items-center gap-2"
      disabled={isCreating}
    >
      <LinkIcon className="h-4 w-4" />
      {isCreating ? "Création..." : "Créer un lien"}
    </Button>
  );
};

export default PaymentLinkButton;