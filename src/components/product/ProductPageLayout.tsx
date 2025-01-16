import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types/product";
import ProductDetails from "./ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";

interface ProductPageLayoutProps {
  product: Product;
}

const ProductPageLayout = ({ product }: ProductPageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <>
          {product.image_url && (
            <div className="w-full h-64 mb-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8 p-6 min-h-screen">
            <div>
              <ProductDetails
                name={product.name}
                description={product.description}
                long_description={product.long_description}
                amount={product.amount}
                imageUrl={product.image_url}
              />
            </div>
            <div>
              <CustomerInfoForm
                amount={product.amount}
                description={product.description || product.name}
                paymentLinkId={product.payment_link_id || ""}
                onClose={() => {}}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 p-6 min-h-screen">
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
              long_description={product.long_description}
              amount={product.amount}
              imageUrl={product.image_url}
            />
          </div>
          <div>
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