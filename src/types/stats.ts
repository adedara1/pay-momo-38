export interface UserStats {
  totalSales: number;
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
  soldAmount: number;
  availableBalance?: number;
  pendingRequests?: number;
  validatedRequests?: number;
}