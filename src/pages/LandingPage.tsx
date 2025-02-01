import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAppName } from "@/hooks/use-app-name";

const LandingPage = () => {
  const navigate = useNavigate();
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const { appName } = useAppName();

  useEffect(() => {
    const fetchHeaderImage = async () => {
      const { data: headerImage } = await supabase
        .from('global_header_images')
        .select('image_url')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (headerImage) {
        setHeaderImageUrl(headerImage.image_url);
      }
    };

    fetchHeaderImage();
  }, []);

  const handleAuthAction = (action: 'signup' | 'login') => {
    navigate('/auth', { state: { initialView: action } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            {headerImageUrl && (
              <img
                src={headerImageUrl}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            )}
            <span className="text-2xl font-bold text-primary">{appName}</span>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              L'agrégateur de paiement qui connecte votre business au monde !
            </h1>
            <p className="text-xl text-gray-600">
              Gérez plusieurs méthodes de paiement en un seul endroit, boostez vos ventes et offrez une expérience client fluide avec {appName}.
            </p>
            <div className="flex gap-4">
              <div className="relative inline-flex group">
                <Button
                  onClick={() => handleAuthAction('signup')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
                >
                  Créer un compte
                </Button>
                <Button
                  onClick={() => handleAuthAction('login')}
                  variant="ghost"
                  className="absolute left-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-full transition-all duration-300"
                >
                  Se connecter
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/lovable-uploads/64e70399-c10b-491c-8d62-e88ee2feba12.png"
              alt="Globe"
              className="w-full h-auto max-w-xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;