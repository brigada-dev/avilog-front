import { api } from './api';

export interface TimeDataItem {
  label: string;
  value: string;
}

export interface TimeSummaryData {
  currency: TimeDataItem[];
  timeLimits: TimeDataItem[];
  summary: TimeDataItem[];
  types: TimeDataItem[];
  operationalConditionTime: TimeDataItem[];
  category: TimeDataItem[];
  landings: TimeDataItem[];
}

export interface TimeSummaryResponse {
  data: TimeSummaryData;
  success: boolean;
  message?: string;
}

export const fetchTimeSummary = async (token?: string): Promise<TimeSummaryResponse> => {
  try {
    const response = await api('/time-summary', token);
    return response;
  } catch (error) {
    console.error('Error fetching time summary:', error);
    return {
      data: {
        currency: [],
        timeLimits: [],
        summary: [],
        types: [],
        operationalConditionTime: [],
        category: [],
        landings: []
      },
      success: false,
      message: 'Failed to fetch time summary'
    };
  }
}; 