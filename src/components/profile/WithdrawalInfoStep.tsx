import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { momoProviders } from "@/data/locationData";

interface WithdrawalInfoStepProps {
  momoProvider: string;
  momoNumber: string;
  autoTransfer: boolean;
  onChange: (field: string, value: string | boolean) => void;
  onBack?: () => void;
}

export const WithdrawalInfoStep = ({
  momoProvider,
  momoNumber,
  autoTransfer,
  onChange,
  onBack,
}: WithdrawalInfoStepProps) => {
  return (
    <div className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Fournisseur Mobile Money</label>
        <Select value={momoProvider} onValueChange={(value) => onChange('momoProvider', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un fournisseur" />
          </SelectTrigger>
          <SelectContent>
            {momoProviders.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                {provider.label}
              </SelectItem>
            ))}
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