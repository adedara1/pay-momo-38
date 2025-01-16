import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      // Ajout d'un délai de 1 seconde avant de réessayer en cas d'échec
      const retryDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      const maxRetries = 3;
      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (!session) {
            console.log('No session found');
            await handleInvalidSession();
            return false;
          }

          // Verify if the user is still valid
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error('User check error:', userError);
            await handleInvalidSession();
            return false;
          }

          // Verify if the user has a valid profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (profileError || !profile) {
            console.error('Profile check error:', profileError);
            await handleInvalidSession();
            return false;
          }

          return true;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw error;
          }
          console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
          await retryDelay(1000); // Attendre 1 seconde avant de réessayer
        }
      }

      return false;
    } catch (error) {
      console.error('Session check error:', error);
      if (error instanceof AuthError && error.message === 'Failed to fetch') {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
          variant: "destructive",
        });
      } else {
        await handleInvalidSession();
      }
      return false;
    }
  };

  const handleInvalidSession = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
    toast({
      title: "Session expirée",
      description: "Veuillez vous reconnecter",
      variant: "destructive",
    });
    
    navigate("/auth");
  };

  return { checkSession };
};