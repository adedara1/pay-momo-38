import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { menuItems, logoutMenuItem } from "@/lib/menuItems";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UserProfile {
  first_name: string;
  last_name: string;
}

interface MainSidebarProps {
  userProfile: UserProfile | null;
}

const MainSidebar = ({ userProfile }: MainSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Menu Admin");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('http')) {
      e.preventDefault();
      setIsSettingsOpen(true);
    }
  };

  return (
    <>
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-background w-64 border-r">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center gap-2 px-4 pb-4 border-b">
            <img
              src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold text-blue-600">Digit-Sarl</span>
          </div>

          {userProfile && (
            <div className="px-4 py-6 text-center border-b">
              <div className="mb-4">
                <img
                  src="/placeholder.svg"
                  alt="Profile"
                  className="w-20 h-20 mx-auto rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Welcome {userProfile.first_name} {userProfile.last_name}
              </p>
            </div>
          )}

          <div className="px-4 py-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
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
                              onClick={(e) => handleLinkClick(e, subItem.path)}
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
                      onClick={(e) => handleLinkClick(e, item.path)}
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

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <div className="w-full h-full overflow-auto">
            <iframe 
              src="https://preview--paydunya-bridge-46.lovable.app/general-settings"
              className="w-full h-full border-0"
              title="Settings"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainSidebar;