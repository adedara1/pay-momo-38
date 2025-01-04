import { supabase } from "@/integrations/supabase/client";
import { walletService, type UserWallet } from "./wallet.service";
import { statsService, type UserStats } from "./stats.service";

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  wallet: UserWallet;
  stats: UserStats;
}

export const userDataService = {
  async searchUser(searchQuery: string): Promise<UserData | null> {
    // Try email search
    const { data: emailSearchData, error: emailSearchError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('company_email', `%${searchQuery}%`)
      .maybeSingle();

    if (emailSearchError) throw emailSearchError;

    // If no result by email, try name search
    let profileData = emailSearchData;
    if (!profileData) {
      const { data: nameSearchData, error: nameSearchError } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .maybeSingle();

      if (nameSearchError) throw nameSearchError;
      profileData = nameSearchData;
    }

    // Try UUID search as last resort
    if (!profileData && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchQuery)) {
      const { data: idSearchData, error: idSearchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', searchQuery)
        .maybeSingle();

      if (idSearchError) throw idSearchError;
      profileData = idSearchData;
    }

    if (!profileData) return null;

    // Get wallet data
    let wallet = await walletService.getWallet(profileData.id);
    if (!wallet) {
      wallet = await walletService.createWallet(profileData.id);
    }

    // Get stats data
    const stats = await statsService.getStats(profileData.id) || {
      salesTotal: 0,
      dailySales: 0,
      monthlySales: 0,
      totalTransactions: 0,
      dailyTransactions: 0,
      monthlyTransactions: 0,
      previousMonthSales: 0,
      previousMonthTransactions: 0,
      salesGrowth: 0,
      totalProducts: 0,
      visibleProducts: 0,
      balance: wallet.available,
    };

    return {
      id: profileData.id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      wallet,
      stats
    };
  },

  async saveUserData(userData: UserData): Promise<void> {
    console.log('Saving user data:', userData);

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
      })
      .eq('id', userData.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }

    // Update wallet
    await walletService.updateWallet(userData.id, userData.wallet);

    // Update stats
    await statsService.updateStats(userData.id, userData.stats);

    console.log('User data saved successfully');
  }
};