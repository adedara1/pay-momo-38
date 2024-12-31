import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { momoProviders } from "@/data/locationData";
import { Label } from "@/components/ui/label";

interface WithdrawalInfoStepProps {
  momoProvider: string;
  momoNumber: string;
  autoTransfer: boolean;
  withdrawalFirstName: string;
  withdrawalLastName: string;
  withdrawalEmail: string;
  onChange: (field: string, value: string | boolean) => void;
  onBack?: () => void;
}

export const WithdrawalInfoStep = ({
  momoProvider,
  momoNumber,
  autoTransfer,
  withdrawalFirstName,
  withdrawalLastName,
  withdrawalEmail,
  onChange,
  onBack,
}: WithdrawalInfoStepProps) => {
  const handleMomoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Supprimer le préfixe + et tous les caractères non numériques
    const value = e.target.value.replace(/\+/g, '').replace(/\D/g, '');
    onChange('momoNumber', value);
  };

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
        <Label>Fournisseur Mobile Money</Label>
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
        <Label>Numéro Mobile Money (sans préfixe international)</Label>
        <Input
          type="tel"
          value={momoNumber}
          onChange={handleMomoNumberChange}
          placeholder="01234567"
          required
        />
      </div>

      <div>
        <Label>Prénom du bénéficiaire</Label>
        <Input
          value={withdrawalFirstName}
          onChange={(e) => onChange('withdrawalFirstName', e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Nom du bénéficiaire</Label>
        <Input
          value={withdrawalLastName}
          onChange={(e) => onChange('withdrawalLastName', e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Email du bénéficiaire</Label>
        <Input
          type="email"
          value={withdrawalEmail}
          onChange={(e) => onChange('withdrawalEmail', e.target.value)}
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
        <Label htmlFor="autoTransfer" className="text-sm text-gray-700">
          Activer le transfert automatique
        </Label>
      </div>
    </div>
  );
};