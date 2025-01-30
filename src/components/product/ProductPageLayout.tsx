import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";
import ProductDetails from "./ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { Tag } from "lucide-react";

interface ProductPageLayoutProps {
  product: Product | SimplePage;
}

const ProductPageLayout = ({ product }: ProductPageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-[#FFAADD] flex items-center justify-center z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6" />
          <span className="text-lg font-semibold">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.amount)}
          </span>
        </div>
      </div>
      <div className="min-h-screen bg-[#FFDDFF] pt-16">
        {isMobile ? (
          <div className="flex flex-col">
            {product.image_url && (
              <div className="w-full h-64">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-6 space-y-8" style={{ backgroundColor: '#FFDDFF' }}>
              <ProductDetails
                name={product.name}
                description={product.description}
                long_description={'long_description' in product ? product.long_description : null}
                amount={product.amount}
                imageUrl={product.image_url}
              />
              <CustomerInfoForm
                amount={product.amount}
                description={product.description || product.name}
                paymentLinkId={product.payment_link_id || ""}
                onClose={() => {}}
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 p-6 min-h-screen max-w-7xl mx-auto">
            <div className="space-y-6">
              {product.image_url && (
                <div className="w-full h-[400px]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <ProductDetails
                name={product.name}
                description={product.description}
                long_description={'long_description' in product ? product.long_description : null}
                amount={product.amount}
                imageUrl={product.image_url}
              />
            </div>
            <div className="sticky top-6">
              <CustomerInfoForm
                amount={product.amount}
                description={product.description || product.name}
                paymentLinkId={product.payment_link_id || ""}
                onClose={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPageLayout;