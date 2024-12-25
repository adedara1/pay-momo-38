import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ProductsList from "@/components/ProductsList";
import ProductForm from "@/components/ProductForm";
import { Plus } from "lucide-react";

const Blog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking profile:", error);
        return;
      }

      if (!profile) {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier votre profil",
        variant: "destructive",
      });
    }
  };

  const generateCustomId = (userId: string, firstName: string, lastName: string) => {
    const baseId = userId.split("-")[0];
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toLowerCase();
    return `${baseId}${initials}`;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      setLoading(true);
      const customId = generateCustomId(session.user.id, firstName, lastName);

      const { error } = await supabase.from("profiles").insert({
        id: session.user.id,
        first_name: firstName,
        last_name: lastName,
        custom_id: customId,
      });

      if (error) throw error;

      toast({
        title: "Profil créé avec succès",
        description: `Votre ID personnalisé est : ${customId}`,
      });

      setShowProfileForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto max-w-md p-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Connexion requise</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
          />
        </Card>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="container mx-auto max-w-md p-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Complétez votre profil</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création du profil..." : "Créer le profil"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <Button 
          onClick={() => setShowProductForm(!showProductForm)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showProductForm ? "Fermer" : "Créer une page produit"}
        </Button>
      </div>
      
      {showProductForm && (
        <Card className="p-6 mb-8 bg-white shadow-lg">
          <ProductForm />
        </Card>
      )}
      
      <ProductsList />
    </div>
  );
};

export default Blog;