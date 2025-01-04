import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        await handleInvalidSession();
        return false;
      }
      
      if (!session) {
        console.error('No session found');
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