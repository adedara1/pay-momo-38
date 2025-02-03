import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Support = () => {
  const { data: activeUrl } = useQuery({
    queryKey: ['active-embedded-url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('embedded_urls')
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
    <div className="w-full h-screen">
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