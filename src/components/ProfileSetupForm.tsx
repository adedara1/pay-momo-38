import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // L'ID personnalisé est maintenant géré par la fonction handle_new_user dans Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
        });

      if (error) throw error;

      // Mettre à jour les métadonnées de l'utilisateur
      await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      });

      toast({
        title: "Profil créé avec succès",
        description: "Votre profil a été mis à jour",
      });

      navigate("/home");
    } catch (error: any) {
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
    <div className="container mx-auto max-w-md p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Complétez votre profil</h2>
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
    </div>
  );
};

export default ProfileSetupForm;