import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppName } from "@/hooks/use-app-name";

const Index = () => {
  const navigate = useNavigate();
  const { appName } = useAppName();
  const [headerImage, setHeaderImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeaderImage = async () => {
      const { data, error } = await supabase
        .from('global_header_images')
        .select('image_url')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching header image:', error);
        return;
      }

      if (data) {
        setHeaderImage(data.image_url);
      }
    };

    fetchHeaderImage();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {headerImage && (
                <img 
                  src={headerImage} 
                  alt={appName}
                  className="h-8 w-auto"
                />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate("/auth")}
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            L'agrégateur de paiement qui{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              connecte
            </span>{' '}
            votre business au monde !
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Gérez plusieurs méthodes de paiement en un seul endroit, boostez vos ventes et offrez une expérience client fluide avec {appName}.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-md"
            >
              Créer un compte
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="px-8 py-6 text-lg"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>

      {/* World Map Illustration */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] bg-[url('/lovable-uploads/41f77b6a-bee1-4164-ba6d-a164ddf4704c.png')] bg-contain bg-center bg-no-repeat" />
        </div>
      </div>

      {/* Spacer for the map */}
      <div className="h-[600px]" />
    </div>
  );
};

export default Index;