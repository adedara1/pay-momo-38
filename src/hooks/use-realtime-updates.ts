import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('Setting up realtime subscriptions for user:', userId);

    const channel = supabase
      .channel('db-changes')
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
          // Invalidate transactions queries to trigger a refresh
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          // Invalidate stats as they depend on transactions
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
        }
      )
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
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_links',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Payment links change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['payment-links'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};