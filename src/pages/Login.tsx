import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: (e.target as HTMLFormElement).email.value,
        password: (e.target as HTMLFormElement).password.value,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      if (user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Bienvenue sur Digit-Sarl
          </h2>
        </div>

        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(false)}
            >
              Déjà un compte ? Se connecter
            </Button>
          </form>
        ) : (
          <>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                  },
                },
              }}
            />
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(true)}
            >
              Pas de compte ? S'inscrire
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;