import { useState, useRef, useEffect } from "react";
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
}

const CustomerInfoForm = ({ amount, description, paymentLinkId, onClose }: CustomerInfoFormProps) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Form is considered visible when 10% is in view
      }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  return (
    <>
      <Card className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

      {/* Fixed payment button that appears when form is not visible */}
      {!isFormVisible && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
          <Button onClick={scrollToForm} className="w-full">
            Payer
          </Button>
        </div>
      )}
    </>
  );
};

export default CustomerInfoForm;