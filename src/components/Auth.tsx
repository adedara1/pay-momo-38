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
    // Clear any existing session on mount
    const clearSession = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    };

    clearSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === "SIGNED_IN" && session?.user?.id) {
        try {
          // First verify the session is valid
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User verification error:', userError);
            throw userError;
          }

          if (!user) {
            throw new Error('No user found after sign in');
          }

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
          await supabase.auth.signOut();
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la connexion",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    // Check for existing session on mount
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

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
        await supabase.auth.signOut();
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