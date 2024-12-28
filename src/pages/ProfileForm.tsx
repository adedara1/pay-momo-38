import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoStep } from "@/components/profile/PersonalInfoStep";
import { CompanyInfoStep } from "@/components/profile/CompanyInfoStep";
import { WithdrawalInfoStep } from "@/components/profile/WithdrawalInfoStep";

const ProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    companyDescription: "",
    whatsappNumber: "",
    companyEmail: "",
    country: "",
    city: "",
    businessSector: "",
    documentNumber: "",
  });
  
  const [withdrawalInfo, setWithdrawalInfo] = useState({
    momoProvider: "",
    momoNumber: "",
    autoTransfer: false,
  });

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const isPersonalInfoValid = () => {
    return personalInfo.firstName && personalInfo.lastName && personalInfo.phoneNumber;
  };

  const isCompanyInfoValid = () => {
    return (
      companyInfo.companyName &&
      companyInfo.companyDescription &&
      companyInfo.whatsappNumber &&
      companyInfo.companyEmail &&
      companyInfo.country &&
      companyInfo.city &&
      companyInfo.businessSector &&
      companyInfo.documentNumber &&
      companyLogo &&
      document
    );
  };

  const isWithdrawalInfoValid = () => {
    return withdrawalInfo.momoProvider && withdrawalInfo.momoNumber;
  };

  const handleTabChange = (value: string) => {
    if (value === "company" && !isPersonalInfoValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez compléter toutes les informations personnelles",
        variant: "destructive",
      });
      return;
    }
    if (value === "withdrawal" && !isCompanyInfoValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez compléter toutes les informations de l'entreprise",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(value);
  };

  const handleBack = async () => {
    if (activeTab === "company") {
      setActiveTab("personal");
    } else if (activeTab === "withdrawal") {
      setActiveTab("company");
    }
  };

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
    if (!isWithdrawalInfoValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez compléter toutes les informations de retrait",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      let companyLogoUrl = null;
      if (companyLogo) {
        const fileExt = companyLogo.name.split('.').pop();
        const fileName = `company-logo-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')  // Changed from 'company-logos' to 'product-images'
          .upload(fileName, companyLogo);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')  // Changed from 'company-logos' to 'product-images'
          .getPublicUrl(fileName);
          
        companyLogoUrl = publicUrl;
      }

      let documentUrl = null;
      if (document) {
        const fileExt = document.name.split('.').pop();
        const fileName = `document-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')  // Changed from 'documents' to 'product-images'
          .upload(fileName, document);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')  // Changed from 'documents' to 'product-images'
          .getPublicUrl(fileName);
          
        documentUrl = publicUrl;
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone_number: personalInfo.phoneNumber,
          company_name: companyInfo.companyName,
          company_description: companyInfo.companyDescription,
          whatsapp_number: companyInfo.whatsappNumber,
          company_email: companyInfo.companyEmail,
          country: companyInfo.country,
          city: companyInfo.city,
          business_sector: companyInfo.businessSector,
          document_number: companyInfo.documentNumber,
          company_logo_url: companyLogoUrl,
          document_url: documentUrl,
          momo_provider: withdrawalInfo.momoProvider,
          momo_number: withdrawalInfo.momoNumber,
          auto_transfer: withdrawalInfo.autoTransfer,
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
        <h1 className="text-3xl font-bold text-center mb-8">Digit-Sarl</h1>
        <h2 className="text-2xl font-bold text-center">Complétez votre profil</h2>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="company" disabled={!isPersonalInfoValid()}>
              Votre entreprise
            </TabsTrigger>
            <TabsTrigger value="withdrawal" disabled={!isCompanyInfoValid()}>
              Informations de retrait
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <TabsContent value="personal" className="space-y-4">
              <PersonalInfoStep
                {...personalInfo}
                onChange={(field, value) => 
                  setPersonalInfo(prev => ({ ...prev, [field]: value }))
                }
              />
              <Button
                type="button"
                className="w-full"
                onClick={() => handleTabChange("company")}
                disabled={!isPersonalInfoValid()}
              >
                Suivant
              </Button>
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
              <CompanyInfoStep
                {...companyInfo}
                onCompanyLogoChange={handleLogoChange}
                onDocumentChange={handleDocumentChange}
                onChange={(field, value) =>
                  setCompanyInfo(prev => ({ ...prev, [field]: value }))
                }
                onBack={handleBack}
              />
              <Button
                type="button"
                className="w-full"
                onClick={() => handleTabChange("withdrawal")}
                disabled={!isCompanyInfoValid()}
              >
                Suivant
              </Button>
            </TabsContent>

            <TabsContent value="withdrawal" className="space-y-4">
              <WithdrawalInfoStep
                {...withdrawalInfo}
                onChange={(field, value) =>
                  setWithdrawalInfo(prev => ({ ...prev, [field]: typeof value === 'boolean' ? value : value }))
                }
                onBack={handleBack}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isWithdrawalInfoValid()}
              >
                {isSubmitting ? "Création en cours..." : "Créer votre compte"}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfileForm;
