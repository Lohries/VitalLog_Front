export interface AnalyticsResponse {
  totalClients: number;
  totalRevenue: number;
  totalItems: number;
  totalProductTypes: number;
  currencySymbol: string;
  lowStockAlerts: number;
  pendingOrders: number;
}
