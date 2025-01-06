import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import ProductDetails from "@/components/product/ProductDetails";
import ProductPaymentForm from "@/components/product/ProductPaymentForm";
import { useToast } from "@/hooks/use-toast";

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

  const handlePayment = (formData: {
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    operator: string;
  }) => {
    console.log("Payment initiated with:", {
      ...formData,
      amount: product?.amount
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden">
          <div className="p-6">
            <Skeleton className="h-64 w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/4" />
            </div>
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
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ProductDetails
                name={product.name}
                description={product.description}
                amount={product.amount}
                imageUrl={product.image_url}
              />
            </div>
            <div>
              <ProductPaymentForm
                amount={product.amount}
                description={product.description || product.name}
                onSubmit={handlePayment}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;