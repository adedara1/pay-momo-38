import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductPreviewDialog from "@/components/ProductPreviewDialog";
import { Product } from "@/types/product";

const PaymentPreview = () => {
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!paymentLinkId) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un ID de lien de paiement",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Searching for product with payment link ID:", paymentLinkId);
      
      const { data, error } = await supabase
        .from("products")
        .select("*, long_description") // Added long_description to the query
        .eq("payment_link_id", paymentLinkId)
        .single();

      if (error) throw error;

      if (data) {
        console.log("Product found:", data);
        setProduct({
          ...data,
          long_description: data.long_description || null
        });
        setIsPreviewOpen(true);
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucun produit trouvé avec cet ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Aperçu de la page de paiement</h1>
      
      <div className="max-w-xl mx-auto">
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Entrez l'ID du lien de paiement"
            value={paymentLinkId}
            onChange={(e) => setPaymentLinkId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>

        <ProductPreviewDialog
          product={product}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      </div>
    </div>
  );
};

export default PaymentPreview;