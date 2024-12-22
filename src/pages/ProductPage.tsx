import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError("Produit non trouvé");
          return;
        }
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
    if (!product?.payment_link_id) {
      toast({
        title: "Erreur",
        description: "Lien de paiement invalide",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Fetching payment link with ID:", product.payment_link_id);
      const { data: paymentLink, error } = await supabase
        .from("payment_links")
        .select("paydunya_token")
        .eq("id", product.payment_link_id)
        .maybeSingle();

      if (error) throw error;
      
      if (!paymentLink || !paymentLink.paydunya_token) {
        throw new Error("Token PayDunya non trouvé");
      }

      console.log("Payment link found:", paymentLink);
      
      // Redirect to PayDunya checkout page
      window.location.href = `https://paydunya.com/checkout/invoice/${paymentLink.paydunya_token}`;
    } catch (err) {
      console.error("Error initiating payment:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'initier le paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
              disabled={isProcessing}
            >
              {isProcessing ? "Traitement..." : "Payer maintenant"}
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