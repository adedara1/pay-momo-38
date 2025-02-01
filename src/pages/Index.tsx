import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-16">
          {headerImage && (
            <img 
              src={headerImage} 
              alt="Logo" 
              className="h-12 w-auto"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              L'agrégateur de paiement qui connecte votre business au monde !
            </h1>
            <p className="text-xl text-gray-600">
              Gérez plusieurs méthodes de paiement en un seul endroit, boostez vos ventes et offrez une expérience client fluide avec {appName}.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full"
              >
                Créer un compte
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="border-2 px-8 py-6 text-lg rounded-full"
              >
                Se connecter
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src="/lovable-uploads/ece6eb8c-387e-4315-871c-8845cbed8606.png"
              alt="Globe"
              className="w-full h-auto max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;