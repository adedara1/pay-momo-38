import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { HeaderImageUpload } from "./shared/HeaderImageUpload";

interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string | null;
  company_logo_url: string | null;
}

interface BlogSidebarProps {
  userProfile: UserProfile | null;
}

const BlogSidebar = ({ userProfile }: BlogSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Menu Admin");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
          console.log('Global header image loaded:', headerImage.image_url);
        }
      } catch (error) {
        console.error('Error loading header image:', error);
      }
    };

    loadHeaderImage();
  }, []);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      window.location.href = "/auth";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-background w-64 border-r">
      <div className="flex flex-col flex-grow pt-0 overflow-y-auto">
        <div 
          className="relative flex items-center gap-2 px-4 py-4 border-b h-16 w-64 flex-shrink-0 whitespace-nowrap"
          style={{
            backgroundImage: headerImageUrl ? `url(${headerImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <HeaderImageUpload />
        </div>

        {/* Company name section */}
        {userProfile?.company_name && (
          <div className="px-4 py-3 border-b">
            <h2 className="sr-only">Entreprise</h2>
            <p className="text-base font-semibold">{userProfile.company_name}</p>
          </div>
        )}

        {/* User profile section */}
        {userProfile && (
          <div className="px-4 py-6 text-center border-b">
            <div className="mb-4">
              <img
                src={userProfile.company_logo_url || "/placeholder.svg"}
                alt="Profile"
                className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Welcome {userProfile.first_name} {userProfile.last_name}
            </p>
          </div>
        )}

        <div className="px-4 py-2">
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {openSubmenu === item.label ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {openSubmenu === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
                              location.pathname === subItem.path
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <logoutMenuItem.icon className="w-4 h-4" />
          <span>{isLoggingOut ? "Déconnexion..." : "Déconnexion"}</span>
        </button>
      </div>
    </div>
  );
};

export default BlogSidebar;
