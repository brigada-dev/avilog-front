import { api } from './api';

interface FlightData {
  date: string;
  duration: number;
}

export interface CrewMember {
  name: string;
  flights: FlightData[];
  total_hours: number;
}

export interface CrewDataItem {
  name: string;
  hours: number;
}

export interface CrewStatsData {
  '`25': CrewDataItem[];
  '1 yr': CrewDataItem[];
  '3 yr': CrewDataItem[];
  'start': CrewDataItem[];
}

export interface CrewStatsResponse {
  data: CrewStatsData;
  success: boolean;
  message?: string;
}

export const fetchCrewStats = async (token?: string): Promise<CrewStatsResponse> => {
  try {
    const response = await api('/crew-stats', token);
    return response;
  } catch (error) {
    console.error('Error fetching crew stats:', error);
    return {
      data: {
        '`25': [],
        '1 yr': [],
        '3 yr': [],
        'start': []
      },
      success: false,
      message: 'Failed to fetch crew statistics'
    };
  }
}; 