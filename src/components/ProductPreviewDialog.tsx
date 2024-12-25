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
      <DialogContent className="w-full min-h-screen sm:min-h-[auto] sm:max-w-4xl mx-auto p-0 sm:p-6 border-0 sm:border">
        <div className="relative w-full h-full bg-white">
          <DialogHeader className="p-4 sm:p-6 space-y-4">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              {product.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-4 sm:p-6">
            <div className="w-full sm:w-1/2 space-y-4 order-2 sm:order-1">
              <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
              <p className="text-xl sm:text-2xl font-semibold">{product.amount} FCFA</p>
              {isSimplePayment ? (
                <SimplePaymentButton product={product} />
              ) : (
                <PaymentLinkButton product={product} />
              )}
            </div>
            
            <div className="w-full sm:w-1/2 order-1 sm:order-2">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Aucune image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;