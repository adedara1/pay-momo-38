import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID du produit manquant");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching product with ID:", id);
        
        const { data, error: queryError } = await supabase
          .from("products")
          .select(`
            *,
            long_description,
            payment_links (
              id,
              moneroo_token,
              status
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (queryError) {
          console.error("Error fetching product:", queryError);
          throw queryError;
        }
        
        if (!data) {
          console.error("Product not found");
          setError("Produit non trouvé");
          return;
        }

        console.log("Product fetched:", data);
        setProduct({
          ...data,
          long_description: data.long_description || null
        } as Product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Impossible de charger le produit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-red-500">{error || "Produit non trouvé"}</p>
      </div>
    );
  }

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

export default ProductPage;