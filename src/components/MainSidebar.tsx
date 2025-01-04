import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";
import BlogSidebar from "./BlogSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string | null;
  company_logo_url: string | null;
}

const MainSidebar = () => {
  const isMobile = useIsMobile();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, company_name, company_logo_url')
          .eq('id', user.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [toast]);

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