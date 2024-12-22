import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  image_url: string;
  payment_link_id: string;
  user_id: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID du produit manquant");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching product with ID:", id);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
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
        
        console.log("Product fetched:", data);
        setProduct(data);
        
        // Check if current user is the owner
        if (session?.user) {
          setCanDelete(session.user.id === data.user_id);
        }
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
    if (!product) return;
    
    setIsProcessing(true);
    try {
      console.log("Creating payment link for product:", product.id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }

      const { data: paymentLinkData, error: createError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: product.amount,
            description: product.description || product.name,
            payment_type: "product",
            product_id: product.id
          }
        }
      );

      if (createError) {
        console.error("Error creating payment link:", createError);
        throw createError;
      }
      
      if (!paymentLinkData?.payment_url) {
        console.error("No payment URL in response:", paymentLinkData);
        throw new Error("Pas de lien de paiement généré");
      }

      console.log("Payment link created:", paymentLinkData);
      window.location.href = paymentLinkData.payment_url;
      
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

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
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
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
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