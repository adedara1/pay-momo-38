import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  salesTotal: number;
  dailySales: number;
  monthlySales: number;
  totalTransactions: number;
  dailyTransactions: number;
  monthlyTransactions: number;
  previousMonthSales: number;
  previousMonthTransactions: number;
  salesGrowth: number;
  totalProducts: number;
  visibleProducts: number;
  balance: number;
}

export interface UserWallet {
  available: number;
  pending: number;
  validated: number;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  wallet: UserWallet;
  stats: UserStats;
}

async function createWallet(userId: string) {
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
  return data;
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

    // Get user stats
    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', profileData.id)
      .maybeSingle();

    if (statsError) throw statsError;

    // Get wallet data
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', profileData.id)
      .maybeSingle();

    if (walletError) throw walletError;

    // If no wallet exists, create one
    const wallet = walletData || await createWallet(profileData.id);

    const stats = statsData || {
      sales_total: 0,
      daily_sales: 0,
      monthly_sales: 0,
      total_transactions: 0,
      daily_transactions: 0,
      monthly_transactions: 0,
      previous_month_sales: 0,
      previous_month_transactions: 0,
      sales_growth: 0,
      total_products: 0,
      visible_products: 0,
      balance: wallet.available,
    };

    return {
      id: profileData.id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      wallet: {
        available: wallet.available,
        pending: wallet.pending,
        validated: wallet.validated,
      },
      stats: {
        salesTotal: stats.sales_total,
        dailySales: stats.daily_sales,
        monthlySales: stats.monthly_sales,
        totalTransactions: stats.total_transactions,
        dailyTransactions: stats.daily_transactions,
        monthlyTransactions: stats.monthly_transactions,
        previousMonthSales: stats.previous_month_sales,
        previousMonthTransactions: stats.previous_month_transactions,
        salesGrowth: stats.sales_growth,
        totalProducts: stats.total_products,
        visibleProducts: stats.visible_products,
        balance: stats.balance,
      }
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
    const { error: walletError } = await supabase
      .from('wallets')
      .upsert({
        user_id: userData.id,
        available: userData.wallet.available,
        pending: userData.wallet.pending,
        validated: userData.wallet.validated,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (walletError) {
      console.error('Error updating wallet:', walletError);
      throw walletError;
    }

    // Update stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userData.id,
        sales_total: userData.stats.salesTotal,
        daily_sales: userData.stats.dailySales,
        monthly_sales: userData.stats.monthlySales,
        total_transactions: userData.stats.totalTransactions,
        daily_transactions: userData.stats.dailyTransactions,
        monthly_transactions: userData.stats.monthlyTransactions,
        previous_month_sales: userData.stats.previousMonthSales,
        previous_month_transactions: userData.stats.previousMonthTransactions,
        sales_growth: userData.stats.salesGrowth,
        total_products: userData.stats.totalProducts,
        visible_products: userData.stats.visibleProducts,
        balance: userData.stats.balance,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (statsError) {
      console.error('Error upserting stats:', statsError);
      throw statsError;
    }

    console.log('User data saved successfully');
  }
};