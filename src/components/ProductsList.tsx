import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getPaymentUrl = (token: string) => {
    return `https://paydunya.com/checkout/invoice/${token}`;
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
                <TableHead>Lien de paiement</TableHead>
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
                  <TableCell className="max-w-xs">
                    {product.payment_links?.paydunya_token ? (
                      <a
                        href={getPaymentUrl(product.payment_links.paydunya_token)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Lien de paiement
                      </a>
                    ) : (
                      <span className="text-gray-500">Aucun lien</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/products/${product.id}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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