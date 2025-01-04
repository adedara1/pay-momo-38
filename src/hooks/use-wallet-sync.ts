import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWalletSync = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('Setting up wallet sync for user:', userId);

    const channel = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Wallet change received:', payload);
          // Invalidate relevant queries to trigger a refresh
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['home-stats'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up wallet sync');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};