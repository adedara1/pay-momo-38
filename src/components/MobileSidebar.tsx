import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // Charger l'image d'en-tête existante
        const { data: headerImages } = await supabase
          .from('header_images')
          .select('image_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (headerImages) {
          setHeaderImage(headerImages.image_url);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour uploader une image",
          variant: "destructive",
        });
        return;
      }

      // Upload l'image dans le bucket Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('header-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique de l'image
      const { data: { publicUrl } } = supabase.storage
        .from('header-images')
        .getPublicUrl(fileName);

      // Mettre à jour ou insérer l'entrée dans la table header_images
      const { error: dbError } = await supabase
        .from('header_images')
        .upsert({
          user_id: user.id,
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      setHeaderImage(publicUrl);
      toast({
        title: "Succès",
        description: "L'image a été uploadée avec succès",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de l'image",
        variant: "destructive",
      });
    }
  };

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
          {/* Header section avec l'upload d'image */}
          <div className="relative flex items-center justify-end p-4 border-b flex-shrink-0 whitespace-nowrap h-16">
            <label className="absolute left-4 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImagePlus className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </label>
            {headerImage && (
              <img
                src={headerImage}
                alt="Header"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="relative z-10 hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
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
            <div className="p-4 text-center border-b">
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

          {/* Menu items */}
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

          {/* Logout section */}
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
      </div>
    </>
  );
};

export default MobileSidebar;