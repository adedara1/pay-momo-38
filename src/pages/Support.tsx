import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Support = () => {
  const isMobile = useIsMobile();
  
  const { data: activeUrl } = useQuery({
    queryKey: ['active-support-embedded-url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_embedded_urls')
        .select('url')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data?.url;
    },
  });

  if (!activeUrl) {
    return null;
  }

  return (
    <div className={`w-full ${isMobile ? 'h-screen' : 'h-screen'}`}>
      <iframe
        src={activeUrl}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Support;