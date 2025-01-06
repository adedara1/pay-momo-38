import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useToast } from "@/hooks/use-toast";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const { toast } = useToast();

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
        setProduct(data as Product);
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-6">
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">{error || "Produit non trouvé"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <ProductDetails
              name={product.name}
              description={product.description}
              long_description={product.long_description}
              amount={product.amount}
              imageUrl={product.image_url}
              isDetailsVisible={isDetailsVisible}
              onToggleDetails={() => setIsDetailsVisible(!isDetailsVisible)}
            />
          </div>
          <div>
            <CustomerInfoForm
              amount={product.amount}
              description={product.description || product.name}
              paymentLinkId={product.payment_link_id || ""}
              onClose={() => {}}
              long_description={product.long_description}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;