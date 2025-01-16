import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import ProductPageLayout from "@/components/product/ProductPageLayout";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  return <ProductPageLayout product={product} />;
};

export default ProductPage;