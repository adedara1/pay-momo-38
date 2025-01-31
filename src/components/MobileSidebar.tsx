import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
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

interface MobileSidebarProps {
  userProfile: UserProfile | null;
}

const MobileSidebar = ({ userProfile }: MobileSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadHeaderImage = async () => {
      try {
        const { data: headerImage, error } = await supabase
          .from('global_header_images')
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
        handleAuthError(error);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/auth");
      setIsCollapsed(true);
    } catch (error) {
      console.error("Error logging out:", error);
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 right-4 z-[60] bg-background shadow-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-[50] bg-background transition-transform duration-300",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div 
            className="relative flex items-center justify-end p-4 border-b h-16 flex-shrink-0 whitespace-nowrap"
            style={{
              backgroundImage: headerImageUrl ? `url(${headerImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <HeaderImageUpload />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {userProfile?.company_name && (
            <div className="px-4 py-3 border-b rounded-[10px] bg-[#e4e6e5] border-2 border-blue-500">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Entreprise</h2>
              <p className="text-base font-semibold text-black">{userProfile.company_name}</p>
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
              <p className="text-sm text-muted-foreground">
                {userProfile.first_name} {userProfile.last_name}
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
                    "flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
                    location.pathname === item.path && "bg-gray-100 dark:bg-gray-800"
                  )}
                  onClick={() => setIsCollapsed(true)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
