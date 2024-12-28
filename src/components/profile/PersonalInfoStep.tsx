import { Input } from "@/components/ui/input";

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  onChange: (field: string, value: string) => void;
}

export const PersonalInfoStep = ({ firstName, lastName, phoneNumber, onChange }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom</label>
        <Input
          value={firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <Input
          value={lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          placeholder="+225 XX XXX XX XX"
          required
        />
      </div>
    </div>
  );
};