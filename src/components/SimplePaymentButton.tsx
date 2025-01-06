import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";
import CustomerInfoForm from "./CustomerInfoForm";
import { Dialog, DialogContent } from "./ui/dialog";

interface SimplePaymentButtonProps {
  product: Product | SimplePage;
}

const SimplePaymentButton = ({ product }: SimplePaymentButtonProps) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePayNow = () => {
    if (product.amount < 200) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum est de 200 FCFA",
        variant: "destructive",
      });
      return;
    }

    setShowCustomerForm(true);
  };

  return (
    <>
      <Button 
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
        onClick={handlePayNow}
      >
        <CreditCard className="mr-2 h-5 w-5" />
        Payer maintenant
      </Button>

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
    </>
  );
};

export default SimplePaymentButton;