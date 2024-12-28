import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePrefetch = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Prefetch user profile
    queryClient.prefetchQuery({
      queryKey: ['profile', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });

    // Prefetch user transactions
    queryClient.prefetchQuery({
      queryKey: ['transactions', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      },
      staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
    });
  }, [userId, queryClient]);
};