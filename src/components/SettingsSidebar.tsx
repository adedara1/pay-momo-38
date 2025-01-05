import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { DataEditorContent } from "./DataEditor/DataEditorContent";

interface UserProfile {
  first_name: string;
  last_name: string;
}

interface SettingsSidebarProps {
  userProfile: UserProfile | null;
}

const settingsMenuItems = [
  { label: "Réglage actuel", path: "/configuration" },
  { label: "Editeur de page", path: "/editeur" },
  { label: "Données", path: "/donnees" },
];

const SettingsSidebar = ({ userProfile }: SettingsSidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("configuration");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMainSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMainSidebar}
          className={cn(
            "bg-background shadow-md hover:bg-accent",
            !isCollapsed && isMobile && "left-[270px]"
          )}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background transition-transform duration-300 ease-in-out",
          isMobile ? (
            isCollapsed ? "-translate-x-full" : "translate-x-0 w-full md:w-64"
          ) : (
            isCollapsed ? "-translate-x-full" : "translate-x-0 w-64"
          ),
          "border-r"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 py-6 border-b">
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
              {settingsMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;