import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerInfoFormProps {
  amount: number;
  description: string;
  paymentLinkId: string;
  onClose: () => void;
  onPaymentStart: (url: string) => void;
}

const CustomerInfoForm = ({ amount, description, paymentLinkId, onClose, onPaymentStart }: CustomerInfoFormProps) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Initializing payment with data:", {
        amount,
        description,
        customer: {
          email: customerEmail,
          first_name: customerFirstName,
          last_name: customerLastName,
          phone: customerPhone
        }
      });

      const { data: paymentData, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          amount: amount,
          description: description,
          customer: {
            email: customerEmail || undefined,
            first_name: customerFirstName || undefined,
            last_name: customerLastName || undefined,
            phone: customerPhone || undefined
          }
        }
      });

      if (error) throw error;

      console.log("Payment initialized:", paymentData);

      if (!paymentData.payment_url) {
        throw new Error("URL de paiement manquante dans la réponse");
      }

      // Instead of redirecting, call the onPaymentStart callback
      onPaymentStart(paymentData.payment_url);
      setIsFormVisible(false);

    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFormVisible) {
    return null;
  }

  return (
    <>
      <div className={`space-y-6 ${isMobile ? '' : 'bg-white p-6 rounded-lg shadow-lg'}`}>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Informations de paiement</h2>
          <p className="text-gray-500">
            Montant à payer: {amount} XOF
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email (optionnel)</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom (optionnel)</label>
              <Input
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                placeholder="Prénom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom (optionnel)</label>
              <Input
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                placeholder="Nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone (optionnel)</label>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+221 XX XXX XX XX"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {isLoading ? "Traitement..." : "Payer maintenant"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default CustomerInfoForm;