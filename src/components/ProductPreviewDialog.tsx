import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PaymentLinkButton from "./PaymentLinkButton";
import SimplePaymentButton from "./SimplePaymentButton";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";

interface ProductPreviewDialogProps {
  product: Product | SimplePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSimplePayment?: boolean;
}

const ProductPreviewDialog = ({ product, open, onOpenChange, isSimplePayment = false }: ProductPreviewDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto px-4 py-8 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-4">
            <p className="text-gray-600">{product.description}</p>
            <p className="text-2xl font-semibold">{product.amount} FCFA</p>
            {isSimplePayment ? (
              <SimplePaymentButton product={product} />
            ) : (
              <PaymentLinkButton product={product} />
            )}
          </div>
          
          <div className="order-first md:order-last">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;