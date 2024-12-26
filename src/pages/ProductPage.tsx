import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePaymentButton from "@/components/SimplePaymentButton";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            payment_links!inner (
              id,
              moneroo_token,
              status
            )
          `)
          .eq("id", id)
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

        // Verify that the payment link is active
        if (!data.payment_links || data.payment_links.status !== 'active') {
          console.error("Product payment link is not active");
          setError("Ce produit n'est pas disponible pour le paiement");
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
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error || "Produit non trouvé"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden bg-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
            <p className="text-3xl font-semibold text-blue-600">
              {product.amount} FCFA
            </p>
            <div className="pt-4">
              <SimplePaymentButton product={product} />
            </div>
          </div>
          
          <div className="order-first md:order-last">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Aucune image</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;