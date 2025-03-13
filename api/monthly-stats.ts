import { api } from './api';

export interface MonthlyDataItem {
  month: string;
  value: number;
}

export interface YearlyData {
  [key: string]: MonthlyDataItem[];
}

export interface MonthlyStatsResponse {
  data: YearlyData;
  success: boolean;
  message?: string;
}

export const fetchMonthlyStats = async (token?: string): Promise<MonthlyStatsResponse> => {
  try {
    const response = await api('/monthly-stats', token);
    return response;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    return {
      data: {},
      success: false,
      message: 'Failed to fetch monthly statistics',
    };
  }
}; 