import { supabase } from "@/integrations/supabase/client";

export interface UserWallet {
  available: number;
  pending: number;
  validated: number;
}

export const walletService = {
  async createWallet(userId: string): Promise<UserWallet> {
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        available: 0,
        pending: 0,
        validated: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      available: data.available,
      pending: data.pending,
      validated: data.validated,
    };
  },

  async updateWallet(userId: string, wallet: UserWallet): Promise<void> {
    const { error } = await supabase
      .from('wallets')
      .upsert({
        user_id: userId,
        available: wallet.available,
        pending: wallet.pending,
        validated: wallet.validated,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  },

  async getWallet(userId: string): Promise<UserWallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? {
      available: data.available,
      pending: data.pending,
      validated: data.validated,
    } : null;
  }
};