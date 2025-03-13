import { api } from './api';

export interface TimeDataItem {
  date: string;
  value: number;
}

export interface TimeSeriesData {
  data: TimeDataItem[];
  success: boolean;
  message?: string;
}

/**
 * Fetch total flight time data for different time periods
 * @param period Optional period to fetch ('1yr', '3yr', '5yr', 'start')
 * @param token Auth token
 * @returns Time series data for the requested period(s)
 */
export const fetchTotalTimeData = async (
  period?: '1yr' | '3yr' | '5yr' | 'start',
  token?: string
): Promise<TimeSeriesData> => {
  try {
    const endpoint = period 
      ? `/time-series/total-time?period=${period}`
      : '/time-series/total-time';
      
    const response = await api(endpoint, token);
    
    // Check if the response is valid
    if (!response || typeof response !== 'object') {
      console.error('Invalid response from time-series API:', response);
      throw new Error('Invalid response from server');
    }
    
    return response as TimeSeriesData;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
}; 