import { Input } from "@/components/ui/input";

interface CustomerInfoInputProps {
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerFirstName: string;
  setCustomerFirstName: (name: string) => void;
  customerLastName: string;
  setCustomerLastName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
}

export const CustomerInfoInput = ({
  customerEmail,
  setCustomerEmail,
  customerFirstName,
  setCustomerFirstName,
  customerLastName,
  setCustomerLastName,
  customerPhone,
  setCustomerPhone,
}: CustomerInfoInputProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email du client (optionnel)</label>
        <Input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="email@exemple.com"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom du client (optionnel)</label>
          <Input
            value={customerFirstName}
            onChange={(e) => setCustomerFirstName(e.target.value)}
            placeholder="Prénom"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nom du client (optionnel)</label>
          <Input
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
            placeholder="Nom"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Téléphone du client (optionnel)</label>
        <Input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="+221 XX XXX XX XX"
        />
      </div>
    </div>
  );
};