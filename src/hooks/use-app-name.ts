import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAppName = () => {
  const { data: appSettings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('app_name')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return {
    appName: appSettings?.app_name || 'Digit-Sarl',
    isLoading
  };
};