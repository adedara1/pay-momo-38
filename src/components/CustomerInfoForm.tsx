import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfoFormProps {
  amount: number;
  description: string;
  paymentLinkId: string;
  onClose: () => void;
  long_description: string | null;
}

const CustomerInfoForm = ({ amount, description, paymentLinkId, onClose, long_description }: CustomerInfoFormProps) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Initiating payment with customer info:", {
        amount,
        description,
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone
      });

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount,
            description,
            payment_type: "product",
            customer: {
              email: customerEmail,
              first_name: customerFirstName,
              last_name: customerLastName,
              phone: customerPhone
            }
          }
        }
      );

      if (paymentError) throw paymentError;

      console.log("Payment initiated successfully:", paymentData);

      // Redirect to Moneroo payment page
      window.location.href = paymentData.payment_url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initiation du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
    if (!isDetailsVisible && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+221 XX XXX XX XX"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Traitement..." : "Payer Maintenant"}
          </Button>
        </form>
      </Card>

      {long_description && (
        <div>
          <button
            onClick={handleToggleDetails}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Voir plus de détails
          </button>
          
          {isDetailsVisible && (
            <Card className="p-6 mt-4" ref={detailsRef}>
              <div id="long-description">
                <h2 className="text-xl font-semibold mb-4">Détails du produit</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{long_description}</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerInfoForm;