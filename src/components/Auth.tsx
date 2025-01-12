import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session?.user?.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
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
        } catch (error) {
          console.error('Error during sign in:', error);
          let errorMessage = "Une erreur est survenue lors de la connexion";
          
          if (error instanceof AuthError) {
            switch (error.message) {
              case 'Failed to fetch':
                errorMessage = "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.";
                break;
              case 'Invalid login credentials':
                errorMessage = "Identifiants invalides. Veuillez réessayer.";
                break;
              default:
                errorMessage = error.message;
            }
          }
          
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    // Check for existing session on mount
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Existing session:', session);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();

          if (!profile?.first_name || !profile?.last_name) {
            navigate("/profile");
          } else {
            navigate("/home");
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        if (error instanceof AuthError && error.message === 'Failed to fetch') {
          toast({
            title: "Erreur de connexion",
            description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
            variant: "destructive",
          });
        }
      }
    };

    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Auth;