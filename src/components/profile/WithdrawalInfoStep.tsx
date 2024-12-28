import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WithdrawalInfoStepProps {
  momoProvider: string;
  momoNumber: string;
  autoTransfer: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

export const WithdrawalInfoStep = ({
  momoProvider,
  momoNumber,
  autoTransfer,
  onChange,
}: WithdrawalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Fournisseur Mobile Money</label>
        <Select value={momoProvider} onValueChange={(value) => onChange('momoProvider', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un fournisseur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtn_ci">MTN Money Côte d'Ivoire</SelectItem>
            <SelectItem value="orange_ci">Orange Money Côte d'Ivoire</SelectItem>
            <SelectItem value="moov_ci">Moov Money Côte d'Ivoire</SelectItem>
            <SelectItem value="wave_ci">Wave Côte d'Ivoire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro Mobile Money</label>
        <Input
          type="tel"
          value={momoNumber}
          onChange={(e) => onChange('momoNumber', e.target.value)}
          placeholder="+225 XX XXX XX XX"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoTransfer"
          checked={autoTransfer}
          onChange={(e) => onChange('autoTransfer', e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="autoTransfer" className="text-sm text-gray-700">
          Activer le transfert automatique
        </label>
      </div>
    </div>
  );
};