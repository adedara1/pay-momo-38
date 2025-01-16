import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";
import ProductDetails from "./ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";

interface ProductPageLayoutProps {
  product: Product | SimplePage;
}

const ProductPageLayout = ({ product }: ProductPageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex-1 p-6 space-y-8">
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
  );
};

export default ProductPageLayout;