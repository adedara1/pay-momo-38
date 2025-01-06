import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";

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
      <DialogContent className="w-full min-h-[auto] sm:max-w-4xl mx-auto p-0 sm:p-6 border-0 sm:border">
        <DialogTitle className="sr-only">Détails du produit</DialogTitle>
        <div className="flex flex-col">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Left side - Product details */}
            <div>
              <ProductDetails
                name={product.name}
                description={product.description}
                amount={product.amount}
                imageUrl={product.image_url}
              />
            </div>

            {/* Right side - Payment form */}
            <div className="bg-white rounded-lg">
              <CustomerInfoForm
                amount={product.amount}
                description={product.description || product.name}
                paymentLinkId={product.payment_link_id || ""}
                onClose={() => onOpenChange(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;