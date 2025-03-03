import { z } from 'zod';
import { api } from './api';

export type Flight = {
  id: number;
  aircraft_id: number;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_date_time: string;
  arrival_date_time: string;
  day_landings: number;
  night_landings: number;
  type_of_flight: string | null;
  approach_type: string | null;
};

export const flightSchema = z.object({
  aircraft_id: z.number().int().positive(),
  departure_airport_id: z.number().int().positive(),
  arrival_airport_id: z.number().int().positive(),
  departure_date_time: z.string().datetime(),
  arrival_date_time: z.string().datetime(),
  day_landings: z.number().int().min(0),
  night_landings: z.number().int().min(0),
  type_of_flight: z.string().max(50).nullable(),
  approach_type: z.string().max(50).nullable(),
});

export type FlightFormData = z.infer<typeof flightSchema>;

export const fetchFlights = async (token?: string): Promise<Flight[]> => {
  const response = await api('/flights', token);
  return response.data;
};

export const createFlight = async (data: FlightFormData, token?: string) => {
  return await api('/flights', token, {
    method: 'POST',
    body: JSON.stringify({
      aircraft_id: data.aircraft_id,
      departure_airport_id: data.departure_airport_id,
      arrival_airport_id: data.arrival_airport_id,
      departure_date_time: new Date(data.departure_date_time).toISOString(),
      arrival_date_time: new Date(data.arrival_date_time).toISOString(),
      day_landings: data.day_landings,
      night_landings: data.night_landings,
      type_of_flight: data.type_of_flight,
      approach_type: data.approach_type,
    }),
  });
};
