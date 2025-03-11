import { api } from './api';

export interface TimeDataItem {
  date: string;
  value: number;
}

export type TimeSeriesData = {
  [key in '1yr' | '3yr' | '5yr' | 'start']: TimeDataItem[];
};

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
    
    // Create default empty data if any period is missing
    const defaultData: TimeSeriesData = {
      '1yr': [],
      '3yr': [],
      '5yr': [],
      'start': []
    };
    
    // Merge the response with the default data
    return { ...defaultData, ...response } as TimeSeriesData;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
}; 