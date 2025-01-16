import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/use-session";
import MobileSidebar from "./MobileSidebar";
import BlogSidebar from "./BlogSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string | null;
  company_logo_url: string | null;
}

const MainSidebar = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { checkSession } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const isValid = await checkSession();
        if (!isValid) {
          console.log('Session is not valid');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user) {
          console.log('Setting user ID:', user.id);
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        toast({
          title: "Error",
          description: "Failed to initialize user session. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    initializeUser();
  }, [checkSession, toast]);

  const { data: userProfile, isError } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, company_name, company_logo_url')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  if (isError) {
    toast({
      title: "Error",
      description: "Failed to load user profile. Please try refreshing the page.",
      variant: "destructive",
    });
  }

  return (
    <>
      {isMobile ? (
        <MobileSidebar userProfile={userProfile} />
      ) : (
        <BlogSidebar userProfile={userProfile} />
      )}
    </>
  );
};

export default MainSidebar;