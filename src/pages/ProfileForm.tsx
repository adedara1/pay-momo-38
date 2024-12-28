import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Étape 1: Informations personnelles
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Étape 2: Informations de l'entreprise
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [businessSector, setBusinessSector] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  
  // Étape 3: Informations de retrait
  const [momoProvider, setMomoProvider] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [autoTransfer, setAutoTransfer] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      let companyLogoUrl = null;
      if (companyLogo) {
        const fileExt = companyLogo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, companyLogo);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);
          
        companyLogoUrl = publicUrl;
      }

      let documentUrl = null;
      if (document) {
        const fileExt = document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, document);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);
          
        documentUrl = publicUrl;
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          company_name: companyName,
          company_description: companyDescription,
          whatsapp_number: whatsappNumber,
          company_email: companyEmail,
          company_logo_url: companyLogoUrl,
          country,
          city,
          business_sector: businessSector,
          document_url: documentUrl,
          document_number: documentNumber,
          momo_provider: momoProvider,
          momo_number: momoNumber,
          auto_transfer: autoTransfer
        });

      if (upsertError) throw upsertError;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });

      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Complétez votre profil</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="company">Votre entreprise</TabsTrigger>
            <TabsTrigger value="withdrawal">Informations de retrait</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="personal">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 XX XXX XX XX"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description de l'entreprise</label>
                  <Textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro WhatsApp</label>
                  <Input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+225 XX XXX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email de l'entreprise</label>
                  <Input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo de l'entreprise</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pays</label>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                  <Input
                    value={businessSector}
                    onChange={(e) => setBusinessSector(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Document (Registre de commerce ou pièce d'identité)</label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de document</label>
                  <Input
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="withdrawal">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fournisseur Mobile Money</label>
                  <Select value={momoProvider} onValueChange={setMomoProvider}>
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
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="+225 XX XXX XX XX"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoTransfer"
                    checked={autoTransfer}
                    onChange={(e) => setAutoTransfer(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="autoTransfer" className="text-sm text-gray-700">
                    Activer le transfert automatique
                  </label>
                </div>
              </div>
            </TabsContent>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfileForm;