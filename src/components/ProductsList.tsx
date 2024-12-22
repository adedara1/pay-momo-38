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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }

      const { data: paymentLink, error: createError } = await supabase
        .from('payment_links')
        .insert({
          amount: products?.find(p => p.id === productId)?.amount || 0,
          description: products?.find(p => p.id === productId)?.description || '',
          payment_type: 'product',
          user_id: session.user.id
        })
        .select()
        .single();

      if (createError) throw createError;

      const { error: updateError } = await supabase
        .from('products')
        .update({ payment_link_id: paymentLink.id })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast({
        title: "Produit activé",
        description: "Le lien de paiement a été créé avec succès",
      });

      window.location.reload();
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
                    <ProductActions 
                      productId={product.id} 
                      hasPaymentLink={!!product.payment_link_id}
                      onActivate={() => handleActivate(product.id)}
                    />
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