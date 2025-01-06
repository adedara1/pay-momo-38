import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProductPaymentFormProps {
  amount: number;
  onSubmit: (formData: {
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    operator: string;
  }) => void;
}

const ProductPaymentForm = ({ amount, onSubmit }: ProductPaymentFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!customerName || !customerEmail || !phoneNumber || !operator) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      customerName,
      customerEmail,
      phoneNumber,
      operator,
    });
  };

  return (
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
            {amount} XOF
          </p>
          <Button 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Payer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductPaymentForm;