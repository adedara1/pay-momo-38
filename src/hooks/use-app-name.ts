import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useAppName = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings'
        },
        (payload) => {
          // Invalidate and refetch when there's a change
          queryClient.invalidateQueries({ queryKey: ['app-settings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: appSettings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      console.log("Fetching app settings...");
      const { data, error } = await supabase
        .from('app_settings')
        .select('app_name')
        .single();
      
      if (error) {
        console.error("Error fetching app name:", error);
        throw error;
      }
      
      console.log("App settings fetched:", data);
      return data;
    },
  });

  return {
    appName: appSettings?.app_name || 'Digit-Sarl',
    isLoading
  };
};