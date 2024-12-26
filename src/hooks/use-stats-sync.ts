import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStatsSync = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('Setting up stats sync for user:', userId);

    const channel = supabase
      .channel('user-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Products change received:', payload);
          // Invalider les requêtes qui dépendent des produits
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Transactions change received:', payload);
          // Invalider les requêtes qui dépendent des transactions
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up stats sync');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};