import { z } from 'zod';
import { api } from './api';

export type Aircraft = {
  id: number;
  registration: string;
  is_aircraft: boolean;
  is_simulator: boolean;
  type: string;
  engine_type: string | null;
  is_multi_engine: boolean;
  is_multi_pilot: boolean;
  remarks?: string;
  image_url: string | null;
};

export const aircraftSchema = z.object({
  registration: z.string().min(1, 'Registration is required').max(50),
  is_aircraft: z.boolean(),
  is_simulator: z.boolean(),
  type: z.string().min(1, 'Aircraft type is required').max(100),
  engine_type: z.enum(['Glider', 'Turboprop', 'Piston', 'Jet'], {
    required_error: 'Engine type is required',
  }),
  is_multi_engine: z.boolean(),
  is_multi_pilot: z.boolean(),
  remarks: z.string().optional(),
  image_url: z.string().url('Invalid URL').nullable().optional(),
});

export type AircraftFormData = z.infer<typeof aircraftSchema>;

export const fetchAircrafts = async (token?: string): Promise<Aircraft[]> => {
  const response = await api('/aircraft', token);
  return response.data;
};

export const createAircraft = async (data: AircraftFormData, token?: string) => {
  const response = await api('/aircraft', token, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const updateAircraft = async (id: number, data: AircraftFormData, token?: string) => {
  const response = await api(`/aircraft/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const deleteAircraft = async (id: number, token?: string) => {
  await api(`/aircraft/${id}`, token, {
    method: 'DELETE',
  });

  return { id };
};

export const fetchAircraftById = async (id: number, token?: string): Promise<Aircraft> => {
  const response = await api(`/aircraft/${id}`, token);
  return response.data;
};
