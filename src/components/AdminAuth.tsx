import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

        // If user is logged in, check if they're an admin
        if (user) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (adminData) {
            navigate("/home");
          } else {
            toast({
              title: "Accès refusé",
              description: "Cette page est réservée aux administrateurs",
              variant: "destructive",
            });
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAndClearSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.id) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (adminData) {
          navigate("/home");
        } else {
          toast({
            title: "Accès refusé",
            description: "Cette page est réservée aux administrateurs",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }

      // Handle user already exists error
      if (event === "USER_SIGNUP_ERROR") {
        const error = session?.error;
        if (error?.message?.includes('User already registered')) {
          toast({
            title: "Erreur d'inscription",
            description: "Cet email est déjà utilisé. Veuillez vous connecter.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>
        <Auth 
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default AdminAuth;