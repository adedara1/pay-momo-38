import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { momoProviders, cedeaoCountries, citiesByCountry } from "@/data/locationData";
import { ArrowLeft } from "lucide-react";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [withdrawalInfo, setWithdrawalInfo] = useState<any>(null);

  useEffect(() => {
    loadProfile();
    loadWithdrawalInfo();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setSelectedCountry(data.country || "");
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive",
      });
    }
  };

  const loadWithdrawalInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("withdrawal_info")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setWithdrawalInfo(data || {});
    } catch (error) {
      console.error("Error loading withdrawal info:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations de retrait",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      // Delete old logo if exists
      if (profile.company_logo_url) {
        const oldPath = profile.company_logo_url.split("/").pop();
        await supabase.storage
          .from("product-images")
          .remove([oldPath]);
      }

      // Update profile with new logo URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ company_logo_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, company_logo_url: publicUrl });
      toast({
        title: "Succès",
        description: "Logo mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le logo",
        variant: "destructive",
      });
    }
  };

  const handleRequestChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("profile_change_requests")
        .insert({
          user_id: profile.id,
          company_name: profile.company_name,
          company_email: profile.company_email,
          country: profile.country,
          city: profile.city,
          business_sector: profile.business_sector,
          document_url: profile.document_url,
          document_number: profile.document_number,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Demande de modification soumise avec succès",
      });
    } catch (error) {
      console.error("Error submitting change request:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la demande de modification",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawalInfoSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("withdrawal_info")
        .upsert({
          user_id: user.id,
          momo_provider: withdrawalInfo.momo_provider,
          momo_number: withdrawalInfo.momo_number,
          beneficiary_first_name: withdrawalInfo.first_name,
          beneficiary_last_name: withdrawalInfo.last_name,
          beneficiary_email: withdrawalInfo.company_email,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Informations de retrait mises à jour avec succès",
      });
      
      // Recharger les informations pour mettre à jour l'affichage
      await loadWithdrawalInfo();
    } catch (error) {
      console.error("Error saving withdrawal info:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de retrait",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>

      {/* Company Logo Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Logo de l'entreprise</h2>
        <div className="flex items-center space-x-4">
          {profile.company_logo_url && (
            <img
              src={profile.company_logo_url}
              alt="Logo"
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button type="button">Changer le logo</Button>
          </label>
        </div>
      </Card>

      {/* Company and Personal Info Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations à modifier (avec approbation)</h2>
        <form onSubmit={handleRequestChange} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
              <Input
                value={profile.company_name || ""}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email de l'entreprise</label>
              <Input
                type="email"
                value={profile.company_email || ""}
                onChange={(e) => setProfile({ ...profile, company_email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pays</label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setProfile({ ...profile, country: value, city: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {cedeaoCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ville</label>
              <Select
                value={profile.city || ""}
                onValueChange={(value) => setProfile({ ...profile, city: value })}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry &&
                    citiesByCountry[selectedCountry]?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
              <Input
                value={profile.business_sector || ""}
                onChange={(e) => setProfile({ ...profile, business_sector: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de document</label>
              <Input
                value={profile.document_number || ""}
                onChange={(e) => setProfile({ ...profile, document_number: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                value={profile.first_name || ""}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                value={profile.last_name || ""}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro</label>
              <Input
                value={profile.phone_number || ""}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Soumettre la demande</Button>
        </form>
      </Card>

      {/* Withdrawal Info Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations de retrait</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fournisseur Mobile Money</label>
              <Select
                value={withdrawalInfo?.momo_provider || ""}
                onValueChange={(value) => setWithdrawalInfo(prev => ({ ...prev, momo_provider: value }))}
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
              <label className="block text-sm font-medium mb-1">Numéro Mobile Money</label>
              <Input
                value={withdrawalInfo?.momo_number || ""}
                onChange={(e) => setWithdrawalInfo(prev => ({ ...prev, momo_number: e.target.value }))}
                placeholder="Sans préfixe international"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prénom du bénéficiaire</label>
              <Input
                value={withdrawalInfo?.beneficiary_first_name || ""}
                onChange={(e) => setWithdrawalInfo(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom du bénéficiaire</label>
              <Input
                value={withdrawalInfo?.beneficiary_last_name || ""}
                onChange={(e) => setWithdrawalInfo(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email du bénéficiaire</label>
              <Input
                type="email"
                value={withdrawalInfo?.beneficiary_email || ""}
                onChange={(e) => setWithdrawalInfo(prev => ({ ...prev, company_email: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleWithdrawalInfoSave} className="w-full">
            Enregistrer
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileManagement;
