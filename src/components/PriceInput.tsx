import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  currency: string;
  setCurrency: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
}

export const PriceInput = ({ currency, setCurrency, amount, setAmount }: PriceInputProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Devise</label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une devise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="XOF">FCFA (XOF)</SelectItem>
            <SelectItem value="USD">Dollar (USD)</SelectItem>
            <SelectItem value="EUR">Euro (EUR)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prix</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Minimum 200 FCFA"
          min="200"
          required
        />
      </div>
    </div>
  );
};