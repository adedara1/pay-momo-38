import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { momoProviders } from "@/data/locationData";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WithdrawalInfoStepProps {
  momoProvider: string;
  momoNumber: string;
  autoTransfer: boolean;
  withdrawalFirstName: string;
  withdrawalLastName: string;
  withdrawalEmail: string;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export const WithdrawalInfoStep = ({
  momoProvider: initialMomoProvider,
  momoNumber: initialMomoNumber,
  autoTransfer: initialAutoTransfer,
  withdrawalFirstName: initialFirstName,
  withdrawalLastName: initialLastName,
  withdrawalEmail: initialEmail,
  onSave,
  onBack,
}: WithdrawalInfoStepProps) => {
  const [formData, setFormData] = useState({
    momo_provider: initialMomoProvider,
    momo_number: initialMomoNumber,
    auto_transfer: initialAutoTransfer,
    first_name: initialFirstName,
    last_name: initialLastName,
    company_email: initialEmail,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMomoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\+/g, '').replace(/\D/g, '');
    handleChange('momo_number', value);
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 p-4">
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
          <Select 
            value={formData.momo_provider} 
            onValueChange={(value) => handleChange('momo_provider', value)}
          >
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
            value={formData.momo_number}
            onChange={handleMomoNumberChange}
            placeholder="01234567"
            required
          />
        </div>

        <div>
          <Label>Prénom du bénéficiaire</Label>
          <Input
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Nom du bénéficiaire</Label>
          <Input
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Email du bénéficiaire</Label>
          <Input
            type="email"
            value={formData.company_email}
            onChange={(e) => handleChange('company_email', e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoTransfer"
            checked={formData.auto_transfer}
            onChange={(e) => handleChange('auto_transfer', e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="autoTransfer" className="text-sm text-gray-700">
            Activer le transfert automatique
          </Label>
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full">
            Enregistrer
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};