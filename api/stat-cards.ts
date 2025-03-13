import { api } from './api';

export interface StatCard {
    title: string;
    time: string;
    landings: number;
    limit: string;
    progress: number;
}

export interface StatCardsResponse {
    data: StatCard[];
    success: boolean;
}

export const fetchStatCards = async (): Promise<StatCard[]> => {
    try {
        const response = await api('/stat-cards') as StatCardsResponse;
        if (!response.success) {
            throw new Error('Failed to fetch stat cards');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching stat cards:', error);
        return [];
    }
}; 