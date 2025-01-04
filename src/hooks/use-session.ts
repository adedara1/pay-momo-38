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
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/auth");
        return false;
      }
      return true;
    } catch (error) {
      console.error('Session check error:', error);
      toast({
        title: "Erreur de session",
        description: "Une erreur est survenue lors de la vérification de la session",
        variant: "destructive",
      });
      navigate("/auth");
      return false;
    }
  };

  return { checkSession };
};