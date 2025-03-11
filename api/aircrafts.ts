import { z } from 'zod';
import { api } from './api';

export const aircraftSchema = z.object({
  id: z.number(),
  registration: z.string().min(1, 'Registration is required').max(50),
  is_aircraft: z.boolean(),
  is_simulator: z.boolean(),
  type: z.string().min(1, 'Aircraft type is required').max(100),
  engine_type: z.enum(['Glider', 'Turboprop', 'Piston', 'Jet'], {
    required_error: 'Engine type is required',
  }),
  is_multi_engine: z.boolean(),
  is_multi_pilot: z.boolean(),
  remarks: z.string().optional().nullable(),
  // Flight stats
  total_flight_time: z.number().default(0),
  total_landings: z.number().default(0),
  total_day_landings: z.number().default(0),
  total_night_landings: z.number().default(0),
  last_flight_date: z.string().nullable().optional(),
  image_url: z.string().url('Invalid URL').nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Aircraft = z.infer<typeof aircraftSchema>;
export type AircraftFormData = Omit<Aircraft, 'id' | 'created_at' | 'updated_at' | 'total_flight_time' | 'total_landings' | 'total_day_landings' | 'total_night_landings' | 'last_flight_date'>;

interface PaginatedResponse<T> {
  current_page?: number;
  data: T[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
  meta?: {
    current_page: number;
    from?: number;
    last_page: number;
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path?: string;
    per_page: number;
    to?: number;
    total: number;
  };
}

export const fetchAircrafts = async (
  page = 1, 
  search?: string, 
  token?: string,
  perPage: number = 20
) => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', page.toString());
  if (search) searchParams.set('search', search);
  searchParams.set('per_page', perPage.toString());
  
  const response = await api(`/aircraft?${searchParams.toString()}`, token);
  
  return response as PaginatedResponse<Aircraft>;
};

export const searchAircrafts = async (query: string, token?: string) => {
  const response = await api(`/aircraft/search?q=${encodeURIComponent(query)}`, token);
  return response.data as Aircraft[];
};

export const createAircraft = async (data: AircraftFormData, token?: string) => {
  const response = await api('/aircraft', token, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data as Aircraft;
};

export const updateAircraft = async (id: number, data: Partial<AircraftFormData>, token?: string) => {
  const response = await api(`/aircraft/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data as Aircraft;
};

// New function to update aircraft stats after a flight
export const updateAircraftStats = async (
  id: number, 
  stats: {
    flight_time: number;
    day_landings: number;
    night_landings: number;
    flight_date: string;
  }, 
  token?: string
) => {
  const response = await api(`/aircraft/${id}/stats`, token, {
    method: 'POST',
    body: JSON.stringify(stats),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data as Aircraft;
};

export const deleteAircraft = async (id: number, token?: string) => {
  const response = await api(`/aircraft/${id}`, token, {
    method: 'DELETE',
  });
  return response.data;
};

export const fetchAircraftById = async (id: number, token?: string): Promise<Aircraft> => {
  const response = await api(`/aircraft/${id}`, token);
  return response.data as Aircraft;
};
