import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductListViewProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string) => void;
}

const ProductListView = ({ products, selectedProducts, onProductSelect }: ProductListViewProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;

  const handleCopyPaymentUrl = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const paymentUrl = `${baseUrl}/product/${productId}`;
    
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
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Montant</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">URL de paiement</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr 
              key={product.id}
              onClick={() => onProductSelect(product.id)}
              className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedProducts.includes(product.id) ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {product.description}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                {product.amount} FCFA
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(product.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 truncate max-w-[200px]">
                    {`${baseUrl}/product/${product.id}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleCopyPaymentUrl(e, product.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListView;