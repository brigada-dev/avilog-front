import { z } from 'zod';
import { api } from './api';

export const airportSchema = z.object({
  id: z.number(),
  name: z.string(),
  icao: z.string(),
  iata: z.string().nullable().optional(),
  faa: z.string().nullable().optional(),
  easa: z.string().nullable().optional(),
  caa: z.string().nullable().optional(),
  dgca: z.string().nullable().optional(),
  country: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Airport = z.infer<typeof airportSchema>;

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const fetchAirports = async (page = 1, search?: string, format: string = 'ICAO', token?: string) => {
  const searchParams = new URLSearchParams();
  if (page) searchParams.set('page', page.toString());
  if (search) searchParams.set('search', search);
  searchParams.set('format', format);
  searchParams.set('per_page', '50');
  
  const response = await api(`/airports?${searchParams.toString()}`, token);
  return response as PaginatedResponse<Airport>;
};

export const searchAirports = async (query: string, format: string = 'ICAO', token?: string) => {
  const response = await api(`/airports/search?q=${encodeURIComponent(query)}&format=${format}`, token);
  return response.data as Airport[];
};
