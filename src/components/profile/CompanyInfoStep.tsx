import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CompanyInfoStepProps {
  companyName: string;
  companyDescription: string;
  whatsappNumber: string;
  companyEmail: string;
  country: string;
  city: string;
  businessSector: string;
  documentNumber: string;
  onCompanyLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: string, value: string) => void;
}

export const CompanyInfoStep = ({
  companyName,
  companyDescription,
  whatsappNumber,
  companyEmail,
  country,
  city,
  businessSector,
  documentNumber,
  onCompanyLogoChange,
  onDocumentChange,
  onChange,
}: CompanyInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
        <Input
          value={companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description de l'entreprise</label>
        <Textarea
          value={companyDescription}
          onChange={(e) => onChange('companyDescription', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro WhatsApp</label>
        <Input
          type="tel"
          value={whatsappNumber}
          onChange={(e) => onChange('whatsappNumber', e.target.value)}
          placeholder="+225 XX XXX XX XX"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email de l'entreprise</label>
        <Input
          type="email"
          value={companyEmail}
          onChange={(e) => onChange('companyEmail', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Logo de l'entreprise</label>
        <Input
          type="file"
          accept="image/*"
          onChange={onCompanyLogoChange}
          className="cursor-pointer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pays</label>
        <Input
          value={country}
          onChange={(e) => onChange('country', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ville</label>
        <Input
          value={city}
          onChange={(e) => onChange('city', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
        <Input
          value={businessSector}
          onChange={(e) => onChange('businessSector', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Document (Registre de commerce ou pièce d'identité)</label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onDocumentChange}
          className="cursor-pointer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de document</label>
        <Input
          value={documentNumber}
          onChange={(e) => onChange('documentNumber', e.target.value)}
          required
        />
      </div>
    </div>
  );
};