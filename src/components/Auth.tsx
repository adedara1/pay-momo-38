import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAppName } from "@/hooks/use-app-name";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appName } = useAppName();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (sessionError.message?.includes('Failed to fetch')) {
            toast({
              title: "Erreur de connexion",
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
              variant: "destructive",
            });
            return;
          }
          throw sessionError;
        }
        
        if (session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            if (profileError.message?.includes('JWT')) {
              await supabase.auth.signOut();
              toast({
                title: "Session expirée",
                description: "Veuillez vous reconnecter",
                variant: "destructive",
              });
              return;
            }
            throw profileError;
          }

          if (!profile?.first_name || !profile?.last_name) {
            navigate("/profile");
          } else {
            navigate("/home");
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'authentification",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            return;
          }

          if (!profile?.first_name || !profile?.last_name) {
            navigate("/profile");
          } else {
            navigate("/home");
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-8 space-y-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              L'agrégateur de paiement qui connecte votre business au monde !
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Gérez plusieurs méthodes de paiement en un seul endroit, boostez vos ventes et offrez une expérience client fluide avec {appName}.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.querySelector('button[type="submit"]')?.click()}
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Créer un compte
              </button>
              <button
                onClick={() => document.querySelector('button[type="submit"]')?.click()}
                className="text-gray-700 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
        <div className={cn("transition-opacity", { "opacity-0": false })}>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;