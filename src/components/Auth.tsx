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
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          handleAuthenticatedUser(session.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
        handleAuthError(error);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === "SIGNED_IN" && session?.user?.id) {
        await handleAuthenticatedUser(session.user.id);
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuthenticatedUser = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        if (profileError.message?.includes('JWT')) {
          await handleSessionExpired();
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
      console.error('Error during authentication:', error);
      handleAuthError(error);
    }
  };

  const handleSessionExpired = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'authentification",
      variant: "destructive",
    });
  };

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