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
    // Check if there's an invalid session and clear it
    const checkAndClearSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error?.message?.includes('User from sub claim in JWT does not exist')) {
          console.log('Invalid session detected, clearing...');
          await supabase.auth.signOut();
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAndClearSession();

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

          // Si le profil n'a pas de nom/prénom, c'est une première inscription
          if (!profile?.first_name || !profile?.last_name) {
            navigate("/profile");
          } else {
            navigate("/home");
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          if (error.message?.includes('User from sub claim in JWT does not exist')) {
            await supabase.auth.signOut();
            toast({
              title: "Erreur d'authentification",
              description: "Veuillez vous reconnecter",
              variant: "destructive",
            });
          }
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