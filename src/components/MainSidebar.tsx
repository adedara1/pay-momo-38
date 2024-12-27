import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItems } from "@/lib/menuItems";
import { useLocation, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserProfile = {
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

const MainSidebar = () => {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          const username = profile.first_name && profile.last_name 
            ? `${profile.first_name} ${profile.last_name}`
            : "Utilisateur";
            
          setUserProfile({
            ...profile,
            username
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 border-r bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </div>

      {/* Profil utilisateur */}
      <div className="flex flex-col items-center py-6 border-b space-y-4">
        <span className="text-lg font-semibold">
          Digit-Sarl
        </span>
        
        <Avatar className="w-20 h-20">
          <AvatarImage 
            src={userProfile?.avatar_url || "/placeholder.svg"} 
            alt="Photo de profil" 
          />
          <AvatarFallback>
            {userProfile?.username?.slice(0, 2).toUpperCase() || "UT"}
          </AvatarFallback>
        </Avatar>
        
        <span className="text-sm">
          Welcome {userProfile?.username || "utilisateur"}
        </span>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item, idx) => (
            <Button
              key={idx}
              asChild
              variant="ghost"
              className={cn(
                "justify-start",
                location.pathname === item.href &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Link to={item.href}>
                {item.icon()}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default MainSidebar;