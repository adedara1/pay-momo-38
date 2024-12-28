import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";
import CustomerInfoForm from "./CustomerInfoForm";
import { Dialog, DialogContent } from "./ui/dialog";

interface PaymentLinkButtonProps {
  product: Product | SimplePage;
}

const PaymentLinkButton = ({ product }: PaymentLinkButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayNow, setShowPayNow] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
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
      console.log("Adding product to cart:", product);

      setShowPayNow(true);
      
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté au panier",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error adding to cart:", error);
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
    console.log("Opening customer form dialog");
    setShowCustomerForm(true);
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
        <Button 
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={handlePayNow}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Payer maintenant
        </Button>
      )}

      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="sm:max-w-[500px]">
          <CustomerInfoForm
            amount={product.amount}
            description={product.description || product.name}
            paymentLinkId={product.payment_link_id || ""}
            onClose={() => setShowCustomerForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentLinkButton;