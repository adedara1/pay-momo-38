import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ProductCard = ({ product, isSelected, onSelect }: ProductCardProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/product/${product.id}`;

  const copyPaymentUrl = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      toast({
        title: "URL copiée",
        description: "L'URL de paiement a été copiée dans le presse-papier",
      });
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de copier l'URL",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">Aucune image</p>
        </div>
      )}
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-xl font-bold text-blue-600">{product.amount} FCFA</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">URL de paiement:</span>
            <Button variant="ghost" size="sm" onClick={copyPaymentUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 break-all bg-gray-50 p-2 rounded">
            {paymentUrl}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;