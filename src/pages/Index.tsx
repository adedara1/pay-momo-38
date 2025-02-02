import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);

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

  return (
    <div className="w-full h-screen">
      {activeEmbedUrl && (
        <iframe
          src={activeEmbedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default Index;