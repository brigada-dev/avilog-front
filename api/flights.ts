import { z } from 'zod';
import { api } from './api';

export type CrewMember = {
  name: string;
  type: string;
};

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
  crew: CrewMember[];
  aircraft_registration: string;
  departure_airport_icao: string;
  arrival_airport_icao: string;
  arrival_country_iso: string;
  departure_country_iso: string;
};

export const flightSchema = z.object({
  departure_airport_id: z.number().int().positive(),
  arrival_airport_id: z.number().int().positive(),
  departure_date_time: z.string().datetime(),
  arrival_date_time: z.string().datetime(),
  aircraft_id: z.number().int().positive(),
  departure: z.object({
    day: z.number().min(0, 'Day count cannot be negative'),
    night: z.number().min(0, 'Night count cannot be negative'),
  }),
  type_of_flight: z.string().max(50).nullable(),
  approach_type: z.string().max(50).nullable(),
  landing: z.object({
    day: z.number().min(0, 'Day count cannot be negative'),
    night: z.number().min(0, 'Night count cannot be negative'),
  }),
  crew: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    })
  ),
  summary: z.object({
    total: z.number().optional(),
    pic: z.number().optional(),
    sic: z.number().optional(),
    picus: z.number().optional(),
    dual: z.number().optional(),
    inst: z.number().optional(),
    multi: z.number().optional(),
    night: z.number().optional(),
    ifr: z.number().optional(),
    ifri: z.number().optional(),
    ifrs: z.number().optional(),
    xc: z.number().optional(),
    rp: z.number().optional(),
    sim: z.number().optional(),
  }),
  signature: z.string().optional(),
  departure_country_iso: z.string().optional(),
  arrival_country_iso: z.string().optional(),
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
      departure: JSON.stringify({
        day: data.departure.day,
        night: data.departure.night,
      }),
      type_of_flight: data.type_of_flight,
      approach_type: data.approach_type,
      landing: JSON.stringify({
        day: data.landing.day,
        night: data.landing.night,
      }),
      crew: JSON.stringify(data.crew),
      summary:
        Object.keys(data.summary).length > 0 ? JSON.stringify(data.summary) : JSON.stringify({}),
      signature: data.signature,
      departure_country_iso: data.departure_country_iso,
      arrival_country_iso: data.arrival_country_iso,
    }),
  });
};
