import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MobileSidebarProps {
  userProfile?: {
    first_name: string;
    last_name: string;
  } | null;
}

const MobileSidebar = ({ userProfile }: MobileSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

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
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        setIsAdmin(!!adminUser);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier le statut administrateur",
          variant: "destructive",
        });
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
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "p-0 w-72",
          isCollapsed ? "w-20" : "w-72"
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

          {/* Navigation section */}
          <div className="flex-1 overflow-auto">
            <nav className="grid gap-1 p-2">
              {menuItems.map((item) =>
                (!item.adminOnly || isAdmin) && (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      location.pathname === item.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Logout section */}
          <div className="mt-auto p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <logoutMenuItem.icon className="h-4 w-4" />
              <span>{logoutMenuItem.title}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;