import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cedeaoCountries, citiesByCountry } from "@/data/locationData";

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
  onBack?: () => void;
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
  onBack,
}: CompanyInfoStepProps) => {
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
        <Select value={country} onValueChange={(value) => onChange('country', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un pays" />
          </SelectTrigger>
          <SelectContent>
            {cedeaoCountries.map((countryName) => (
              <SelectItem key={countryName} value={countryName}>
                {countryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ville</label>
        <Select 
          value={city} 
          onValueChange={(value) => onChange('city', value)}
          disabled={!country || !citiesByCountry[country]}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une ville" />
          </SelectTrigger>
          <SelectContent>
            {country && citiesByCountry[country]?.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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