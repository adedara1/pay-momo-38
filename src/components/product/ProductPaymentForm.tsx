import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductPaymentFormProps {
  amount: number;
  description: string;
  onSubmit?: (formData: {
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    operator: string;
  }) => void;
}

const ProductPaymentForm = ({ amount, description }: ProductPaymentFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !phoneNumber || !operator) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Initializing payment with data:", {
        amount,
        description,
        customer: {
          email: customerEmail,
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' '),
          phone: phoneNumber
        },
        payment_method: operator
      });

      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          amount: amount,
          description: description,
          customer: {
            email: customerEmail,
            first_name: customerName.split(' ')[0],
            last_name: customerName.split(' ').slice(1).join(' '),
            phone: phoneNumber
          },
          payment_method: operator
        }
      });

      if (error) throw error;

      console.log("Payment initialized:", data);

      // Rediriger vers l'URL de paiement Moneroo
      if (data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error("URL de paiement manquante dans la réponse");
      }

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paiement</h2>
      <p className="text-gray-600">
        Pour procéder à l'achat, veuillez compléter les informations demandées.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement en cours..." : "Payer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductPaymentForm;