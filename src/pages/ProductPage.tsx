import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");

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

  const handlePayment = () => {
    if (!customerName || !customerEmail || !phoneNumber || !operator) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Implement payment logic here
    console.log("Payment initiated with:", {
      customerName,
      customerEmail,
      phoneNumber,
      operator,
      amount: product?.amount
    });
  };

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
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left side - Product details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-xl font-semibold">{product.amount} XOF</p>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Right side - Payment form */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Paiement</h2>
            <p className="text-gray-600">
              Pour procéder à l'achat, veuillez compléter les informations demandées.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom et prénom</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Telimwe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="telimwe@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Numéro mobile money</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="XXX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Opérateur</label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="moov">Moov Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <p className="text-right font-semibold mb-4">
                  {product.amount} XOF
                </p>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={handlePayment}
                >
                  Payer
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;