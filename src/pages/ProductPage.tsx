import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import ProductPageLayout from "@/components/product/ProductPageLayout";
import { useQuery } from "@tanstack/react-query";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error("ID du produit manquant");

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
        throw new Error("Produit non trouvé");
      }

      console.log("Product found:", data);
      return {
        ...data,
        long_description: data.long_description || null
      } as Product;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 animate-in fade-in-50">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </p>
          <p className="text-gray-600">
            Veuillez réessayer plus tard ou contacter le support si le problème persiste.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-600">Produit non trouvé</p>
      </div>
    );
  }

  return <ProductPageLayout product={product} />;
};

export default ProductPage;