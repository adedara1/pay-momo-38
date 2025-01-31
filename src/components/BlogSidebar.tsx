import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Menu Admin");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [showLogoAndName, setShowLogoAndName] = useState(true);

  // Charger l'image d'en-tête au chargement du composant
  useEffect(() => {
    const loadHeaderImage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: headerImage, error } = await supabase
          .from('header_images')
          .select('image_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching header image:', error);
          return;
        }

        if (headerImage) {
          setHeaderImageUrl(headerImage.image_url);
          console.log('Header image loaded:', headerImage.image_url);
        }
      } catch (error) {
        console.error('Error loading header image:', error);
      }
    };

    loadHeaderImage();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `header-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // First delete any existing header image for this user
      await supabase
        .from('header_images')
        .delete()
        .eq('user_id', user.id);

      // Then insert the new one
      const { error: dbError } = await supabase
        .from('header_images')
        .insert({
          user_id: user.id,
          image_url: publicUrl
        });

      if (dbError) {
        throw dbError;
      }

      setHeaderImageUrl(publicUrl);
      console.log('Header image saved:', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        // Filter menu items based on admin status
        const filtered = menuItems.filter(item => 
          item.label !== "Menu Admin" || (item.label === "Menu Admin" && !!adminUser)
        );
        setFilteredMenuItems(filtered);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
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
        {/* Logo section with upload icon and toggle button */}
        <div 
          className="relative flex items-center gap-2 px-4 py-4 border-b h-16 w-64"
          style={{
            backgroundImage: headerImageUrl ? `url(${headerImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '64px',
          }}
        >
          <button
            onClick={() => setShowLogoAndName(!showLogoAndName)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            {showLogoAndName ? (
              <EyeOff className="w-4 h-4 text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <label 
            htmlFor="header-image-upload" 
            className="absolute top-2 left-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ImagePlus className="w-5 h-5 text-blue-600" />
            <input
              id="header-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {showLogoAndName && (
            <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
              <img
                src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
                alt="Logo"
                className="w-8 h-8 relative z-10"
              />
              <span className="font-semibold text-blue-600 relative z-10 whitespace-nowrap">Digit-Sarl</span>
            </div>
          )}
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
