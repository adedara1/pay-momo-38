import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppName } from "@/hooks/use-app-name";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { appName } = useAppName();
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userId) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
        
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [userId]);

  useEffect(() => {
    const fetchActiveEmbedUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('embedded_urls')
          .select('url')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching embed URL:', error);
          return;
        }

        if (data) {
          setActiveEmbedUrl(data.url);
        }
      } catch (error) {
        console.error('Error fetching embed URL:', error);
      }
    };

    fetchActiveEmbedUrl();
  }, []);

  const handleSaveEmbedUrl = async () => {
    if (!embedUrl || !userId) return;

    try {
      // First, update all existing URLs to be inactive
      await supabase
        .from('embedded_urls')
        .update({ is_active: false })
        .eq('is_active', true);

      // Then insert the new URL as active
      const { error } = await supabase
        .from('embedded_urls')
        .insert([
          {
            url: embedUrl,
            created_by: userId,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast.success("URL embedded successfully!");
      setActiveEmbedUrl(embedUrl);
      setEmbedUrl('');
    } catch (error) {
      console.error('Error saving embed URL:', error);
      toast.error("Failed to save embedded URL");
    }
  };

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
          <div className="space-y-8 order-2 lg:order-1">
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
        </div>

        <div className="mt-16 w-full">
          {isAdmin && (
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Entrez l'URL du site à afficher"
                className="w-full p-4 border rounded-lg"
              />
              <Button 
                onClick={handleSaveEmbedUrl}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Enregistrer l'URL
              </Button>
            </div>
          )}
          {activeEmbedUrl && (
            <div className="w-full aspect-[16/9]">
              <iframe
                src={activeEmbedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
