import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface UserProfile {
  first_name: string;
  last_name: string;
}

interface SettingsSidebarProps {
  userProfile: UserProfile | null;
}

const settingsMenuItems = [
  { label: "Réglage actuel", path: "/settings" },
];

const SettingsSidebar = ({ userProfile }: SettingsSidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    quantity: "",
    isPublic: false,
    isDownloadable: false,
    isSubscription: false,
    subscriptionDuration: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

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
    if (!isCollapsed) {
      setIsEditSidebarOpen(false);
    }
  };

  const toggleEditSidebar = () => {
    setIsEditSidebarOpen(!isEditSidebarOpen);
    if (!isEditSidebarOpen) {
      setIsCollapsed(true);
    }
  };

  // ... keep existing code (main sidebar JSX)

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEditSidebar}
          className="bg-background shadow-md hover:bg-accent"
        >
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Settings Sidebar */}
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
                    "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
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

      {/* Edit Settings Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background transition-transform duration-300 ease-in-out",
          isMobile ? (
            !isEditSidebarOpen ? "-translate-x-full" : "translate-x-0 w-full md:w-64"
          ) : (
            !isEditSidebarOpen ? "-translate-x-full" : "translate-x-0 w-64"
          ),
          "border-r overflow-y-auto"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 py-6 border-b">
            <img
              src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold text-blue-600">Mode Édition</span>
          </div>

          <div className="px-4 py-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nom du produit</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom du produit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Description du produit</Label>
                <Input
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  placeholder="Entrez la description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublic">Produit public</Label>
                <Switch
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isPublic: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isDownloadable">Produit téléchargeable</Label>
                <Switch
                  id="isDownloadable"
                  name="isDownloadable"
                  checked={formData.isDownloadable}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isDownloadable: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isSubscription">Abonnement</Label>
                <Switch
                  id="isSubscription"
                  name="isSubscription"
                  checked={formData.isSubscription}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isSubscription: checked }))
                  }
                />
              </div>

              {formData.isSubscription && (
                <div className="space-y-2">
                  <Label htmlFor="subscriptionDuration">Durée de l'abonnement (en jours)</Label>
                  <Input
                    id="subscriptionDuration"
                    name="subscriptionDuration"
                    type="number"
                    value={formData.subscriptionDuration}
                    onChange={handleInputChange}
                    placeholder="30"
                  />
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button className="w-full" type="submit">
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;
