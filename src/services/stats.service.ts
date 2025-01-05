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
  availableBalance: number;
  pendingRequests: number;
  validatedRequests: number;
}

export const statsService = {
  async updateStats(userId: string, stats: UserStats): Promise<void> {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        sales_total: stats.salesTotal,
        daily_sales: stats.dailySales,
        monthly_sales: stats.monthlySales,
        total_transactions: stats.totalTransactions,
        daily_transactions: stats.dailyTransactions,
        monthly_transactions: stats.monthlyTransactions,
        previous_month_sales: stats.previousMonthSales,
        previous_month_transactions: stats.previousMonthTransactions,
        sales_growth: stats.salesGrowth,
        total_products: stats.totalProducts,
        visible_products: stats.visibleProducts,
        balance: stats.balance,
        available_balance: stats.availableBalance,
        pending_requests: stats.pendingRequests,
        validated_requests: stats.validatedRequests,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  async getStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? {
      salesTotal: data.sales_total,
      dailySales: data.daily_sales,
      monthlySales: data.monthly_sales,
      totalTransactions: data.total_transactions,
      dailyTransactions: data.daily_transactions,
      monthlyTransactions: data.monthly_transactions,
      previousMonthSales: data.previous_month_sales,
      previousMonthTransactions: data.previous_month_transactions,
      salesGrowth: data.sales_growth,
      totalProducts: data.total_products,
      visibleProducts: data.visible_products,
      balance: data.balance,
      availableBalance: data.available_balance,
      pendingRequests: data.pending_requests,
      validatedRequests: data.validated_requests,
    } : null;
  }
};