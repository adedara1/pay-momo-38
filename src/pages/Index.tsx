import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });

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
      await supabase
        .from('embedded_urls')
        .update({ is_active: false })
        .eq('is_active', true);

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
      {isAdmin && (
        <div className="flex flex-col gap-4 mb-4 p-4">
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
  );
};

export default Index;