import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { HeaderImageUpload } from "./shared/HeaderImageUpload";

interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string | null;
  company_logo_url: string | null;
}

interface MainSidebarProps {
  userProfile: UserProfile | null;
}

const MainSidebar = ({ userProfile }: MainSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadHeaderImage = async () => {
      try {
        const { data: headerImage, error } = await supabase
          .from('header_images')
          .select('image_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching header image:', error);
          return;
        }

        if (headerImage) {
          setHeaderImageUrl(headerImage.image_url);
        }
      } catch (error) {
        console.error('Error loading header image:', error);
      }
    };

    loadHeaderImage();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        const filtered = menuItems.filter(item => 
          item.label !== "Menu Admin" || (item.label === "Menu Admin" && !!adminUser)
        );
        setFilteredMenuItems(filtered);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du statut administrateur.",
          variant: "destructive",
        });
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden md:flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div 
        className="relative flex items-center justify-between p-4 border-b h-16 flex-shrink-0 whitespace-nowrap"
        style={{
          backgroundImage: headerImageUrl ? `url(${headerImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <HeaderImageUpload />
      </div>

      {userProfile?.company_name && (
        <div className="px-4 py-3 border-b">
          <h2 className="sr-only">Entreprise</h2>
          <p className="text-base font-semibold text-sidebar-foreground">{userProfile.company_name}</p>
        </div>
      )}

      {userProfile && (
        <div className="p-4 text-center border-b">
          <div className="mb-4">
            <img
              src={userProfile.company_logo_url || "/placeholder.svg"}
              alt="Profile"
              className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-blue-500"
            />
          </div>
          <p className="text-sm text-sidebar-foreground">
            Welcome {userProfile.first_name} {userProfile.last_name}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <logoutMenuItem.icon className="h-5 w-5" />
          <span>{logoutMenuItem.label}</span>
        </button>
      </div>
    </div>
  );
};

export default MainSidebar;