import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfileSetupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateCustomId = (userId: string, firstName: string, lastName: string) => {
    const baseId = userId.split("-")[0];
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toLowerCase();
    return `${baseId}_${initials}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const customId = generateCustomId(user.id, firstName, lastName);

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          custom_id: customId,
        });

      if (error) throw error;

      // Mettre à jour les métadonnées de l'utilisateur
      await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      });

      toast({
        title: "Profil créé avec succès",
        description: `Votre ID personnalisé est : ${customId}`,
      });

      // Recharger la page pour mettre à jour le contexte d'authentification
      window.location.reload();
    } catch (error: any) {
      console.error("Erreur lors de la création du profil:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Complétez votre profil
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                Prénom
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Entrez votre prénom"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Nom
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Entrez votre nom"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création du profil..." : "Créer le profil"}
            </Button>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupForm;