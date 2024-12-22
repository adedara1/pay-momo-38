import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import ProductActions from "./ProductActions";
import { useToast } from "@/hooks/use-toast";
import PaymentLinkButton from "./PaymentLinkButton";

const ProductsList = () => {
  const { toast } = useToast();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          payment_links (
            id,
            paydunya_token
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products fetched:", data);
      return data;
    },
  });

  const handleActivate = async (productId: string) => {
    try {
      const product = products?.find(p => p.id === productId);
      if (!product) return;

      // Find the PaymentLinkButton component for this product and trigger its activation
      const paymentLinkButton = document.querySelector(`[data-product-id="${productId}"]`);
      if (paymentLinkButton) {
        const activateButton = paymentLinkButton.querySelector('button[data-activate]');
        if (activateButton) {
          activateButton.click();
        }
      }

      toast({
        title: "URL de paiement activée",
        description: "L'URL de paiement est maintenant visible",
      });
    } catch (error) {
      console.error("Error activating product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mes produits</h2>
      
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : products?.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {new Date(product.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.amount} FCFA</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div data-product-id={product.id}>
                        <PaymentLinkButton product={product} />
                      </div>
                      <ProductActions 
                        productId={product.id} 
                        hasPaymentLink={!!product.payment_links?.paydunya_token}
                        onActivate={() => handleActivate(product.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default ProductsList;