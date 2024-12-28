import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

interface UserProfile {
  first_name: string;
  last_name: string;
}

interface SettingsSidebarProps {
  userProfile: UserProfile | null;
}

const settingsMenuItems = [
  { icon: Settings, label: "Réglages", path: "/settings" },
];

const SettingsSidebar = ({ userProfile }: SettingsSidebarProps) => {
  const location = useLocation();

  return (
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
            {settingsMenuItems.map((item) => (
              <Link
                key={item.path}
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
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;