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
import { useState, useEffect } from "react";
import ProductPreviewDialog from "./ProductPreviewDialog";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatsSync } from "@/hooks/use-stats-sync";

const ProductsList = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Récupérer l'ID de l'utilisateur
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  // Activer la synchronisation en temps réel
  useStatsSync(userId || undefined);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", userId],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID available");
        return [];
      }

      console.log("Fetching products for user:", userId);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          payment_links (
            id,
            moneroo_token
          )
        `)
        .eq('user_id', userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Products fetched:", data);
      return data as Product[];
    },
    enabled: !!userId, // Only run query when userId is available
  });

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
    setPreviewOpen(true);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold mb-4">Mes produits</h2>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : !products || products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun produit</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Montant</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow 
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-sm text-gray-600">
                    {new Date(product.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {product.amount} FCFA
                  </TableCell>
                  <TableCell>
                    <ProductActions 
                      productId={product.id} 
                      hasPaymentLink={!!product.payment_links?.moneroo_token}
                      onPreview={() => handlePreview(product)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductPreviewDialog
        product={selectedProduct}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </Card>
  );
};

export default ProductsList;