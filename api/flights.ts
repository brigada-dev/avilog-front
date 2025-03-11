import { z } from 'zod';
import { api } from './api';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export type CrewMember = {
  name: string;
  type: string;
};

export type Airport = {
  id: number;
  name: string;
  country: string;
  code: string;
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
  crew: CrewMember[] | string;
  aircraft_registration: string;
  departure_airport_code: string;
  arrival_airport_code: string;
  arrival_country_iso: string;
  departure_country_iso: string;
  departure_airport: Airport;
  arrival_airport: Airport;
  aircraft: {
    id: number;
    registration: string;
    type: string;
    imageUrl: string | null;
    flightTime: string;
    flights: number;
  };
  summary: {
    total?: number;
    pic?: number;
    sic?: number;
    picus?: number;
    dual?: number;
    inst?: number;
    multi?: number;
    night?: number;
    ifr?: number;
    ifri?: number;
    ifrs?: number;
    xc?: number;
    rp?: number;
    sim?: number;
  } | string;
  signature: string | null;
  departure?: { day: number; night: number } | string;
  landing?: { day: number; night: number } | string;
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

export const fetchFlights = async (token?: string, limit?: number): Promise<Flight[]> => {
  const params = new URLSearchParams();
  if (limit) {
    params.append('limit', limit.toString());
  }
  const queryString = params.toString();
  const url = queryString ? `/flights?${queryString}` : '/flights';
  const response = await api(url, token);
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

// Helper function to parse crew data
export const parseCrew = (crew: Flight['crew']): CrewMember[] => {
  if (!crew) {
    return [];
  }
  
  if (typeof crew === 'string') {
    try {
      const parsed = JSON.parse(crew);
      // Check if the parsed result is an array
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        console.error('Parsed crew data is not an array:', parsed);
        return [];
      }
    } catch (e) {
      console.error('Error parsing crew data:', e);
      return [];
    }
  }
  
  // If crew is already an array, return it
  if (Array.isArray(crew)) {
    return crew;
  }
  
  // If we get here, something unexpected happened
  console.error('Unexpected crew data format:', crew);
  return [];
};

export const fetchFlight = async (id: string | number, token?: string): Promise<Flight> => {
  const response = await api(`/flights/${id}`, token);
  return response.data;
};

export const updateFlight = async (id: number, data: FlightFormData, token: string) => {
  try {
    // JSON.stringify all nested objects as required by the StoreFlightRequest validation rules
    const requestBody = {
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
      summary: Object.keys(data.summary).length > 0 ? JSON.stringify(data.summary) : JSON.stringify({}),
      signature: data.signature,
      departure_country_iso: data.departure_country_iso,
      arrival_country_iso: data.arrival_country_iso,
    };
    
    // Add the Content-Type header to specify JSON format
    // Also add X-HTTP-Method-Override header for PUT method
    const response = await api(`/flights/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'X-HTTP-Method-Override': 'PUT',
        'Accept': 'application/json'
      }
    });
    
    // Parse the response data
    const responseData = response.data;
    
    // Create a properly formatted response that matches the Flight type
    const formattedResponse = {
      ...response,
      data: {
        ...responseData,
        // Always use the submitted data because the backend might not return all crew members
        crew: data.crew,
        // Always use the submitted summary data because the backend might not return all fields
        summary: data.summary,
        // Convert departure/landing from empty arrays to submitted objects if needed
        departure: Array.isArray(responseData.departure) && responseData.departure.length === 0 
                  ? data.departure 
                  : responseData.departure,
        landing: Array.isArray(responseData.landing) && responseData.landing.length === 0
                ? data.landing
                : responseData.landing
      }
    };
    
    return formattedResponse;
  } catch (error: any) {
    throw error;
  }
};
