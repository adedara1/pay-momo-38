import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";
import { SimplePage } from "@/types/simple-page";

interface ProductPreviewDialogProps {
  product: Product | SimplePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSimplePayment?: boolean;
}

const ProductPreviewDialog = ({ product, open, onOpenChange, isSimplePayment = false }: ProductPreviewDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");

  if (!product) return null;

  const handlePayment = () => {
    // Implement payment logic here
    console.log("Payment initiated with:", {
      customerName,
      customerEmail,
      phoneNumber,
      operator,
      amount: product.amount
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full min-h-[auto] sm:max-w-4xl mx-auto p-0 sm:p-6 border-0 sm:border">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Product details */}
          <div className="p-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                <p className="text-gray-400">Aucune image</p>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold">{product.amount} XOF</p>
          </div>

          {/* Right side - Payment form */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold">Paiement</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-600 mb-6">
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;