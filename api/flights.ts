import { z } from 'zod';
import { api } from './api';

export type Flight = {
  id: number;
  registration: string;
  type: string;
  date: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
  aircraft: {
    type: string;
    imageUrl: string | null;
    flightTime: string;
    flights: number;
  };
  crew: {
    sic: string;
    pic: string;
  };
  summary: {
    total: string;
    sic: string;
    mp: string;
    ifr: string;
    xc: string;
  };
  created_at: string;
  updated_at: string;
};

const flightSchema = z.object({
  registration: z.string().min(1, 'Registration is required'),
  type: z.string().min(1, 'Aircraft type is required'),
  from: z.string().min(1, 'Departure airport is required'),
  to: z.string().min(1, 'Arrival airport is required'),
  depDate: z.date(),
  arrDate: z.date(),
  depTime: z.date(),
  arrTime: z.date(),
  duration: z.string(),
  aircraft: z.object({
    type: z.string(),
    imageUrl: z.string().nullable(),
    flightTime: z.string(),
    flights: z.number(),
  }),
  crew: z.object({
    sic: z.string(),
    pic: z.string(),
  }),
  summary: z.object({
    total: z.string(),
    sic: z.string(),
    mp: z.string(),
    ifr: z.string(),
    xc: z.string(),
  }),
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
      registration: data.registration,
      type: data.type,
      depDate: data.depDate.toISOString().split('T')[0],
      arrDate: data.arrDate.toISOString().split('T')[0],
      from: data.from,
      to: data.to,
      depTime: data.depTime.toISOString().split('T')[1].slice(0, 5),
      arrTime: data.arrTime.toISOString().split('T')[1].slice(0, 5),
      duration: data.duration,
      aircraft: {
        type: data.aircraft.type,
        imageUrl: data.aircraft.imageUrl,
        flightTime: data.aircraft.flightTime,
        flights: data.aircraft.flights,
      },
      crew: {
        sic: data.crew.sic,
        pic: data.crew.pic,
      },
      summary: {
        total: data.summary.total,
        sic: data.summary.sic,
        mp: data.summary.mp,
        ifr: data.summary.ifr,
        xc: data.summary.xc,
      },
    }),
  });
};
