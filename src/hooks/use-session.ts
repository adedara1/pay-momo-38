import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log('Session check failed:', error);
        await handleInvalidSession();
        return false;
      }
      
      // Vérifier si la session est toujours valide
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log('User check failed:', userError);
        await handleInvalidSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session check error:', error);
      await handleInvalidSession();
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