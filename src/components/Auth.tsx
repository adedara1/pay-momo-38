import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier la session au chargement
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user?.id) {
        navigate("/home");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === "SIGNED_IN" && session?.user?.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (!profile?.first_name || !profile?.last_name) {
            navigate("/profile");
          } else {
            navigate("/home");
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          // Si l'erreur est liée à une session invalide, déconnectez l'utilisateur
          if (error.message?.includes('JWT')) {
            await supabase.auth.signOut();
            toast({
              title: "Session expirée",
              description: "Veuillez vous reconnecter",
              variant: "destructive",
            });
          }
        }
      } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        // Nettoyer la session locale
        await supabase.auth.signOut();
        navigate("/auth");
      }
    });

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