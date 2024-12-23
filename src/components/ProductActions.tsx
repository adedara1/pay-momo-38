import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProductActionsProps {
  productId: string;
  hasPaymentLink: boolean;
  onPreview: () => void;
}

const ProductActions = ({ productId, hasPaymentLink, onPreview }: ProductActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

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

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={onPreview}>
        <Eye className="h-4 w-4" />
      </Button>
      <Link to={`/products/${productId}`} target="_blank">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductActions;