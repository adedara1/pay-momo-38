import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  image_url: string;
  payment_link_id: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Impossible de charger le produit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePayment = async () => {
    if (!product?.payment_link_id) return;

    try {
      const { data, error } = await supabase
        .from("payment_links")
        .select("paydunya_token")
        .eq("id", product.payment_link_id)
        .single();

      if (error) throw error;

      // Redirect to PayDunya checkout page
      window.location.href = `https://paydunya.com/checkout/invoice/${data.paydunya_token}`;
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError("Impossible d'initier le paiement");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Produit non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-2xl font-semibold">{product.amount} FCFA</p>
            <Button
              size="lg"
              className="w-full"
              onClick={handlePayment}
            >
              Payer maintenant
            </Button>
          </div>
          
          <div className="order-first md:order-last">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;