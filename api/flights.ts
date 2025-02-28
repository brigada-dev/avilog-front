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

export const flightSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number().int().positive().optional(),
  aircraft_id: z.number().int().positive(),
  departure_airport_id: z.number().int().positive(),
  arrival_airport_id: z.number().int().positive(),
  departure_date_time: z.string().datetime(),
  arrival_date_time: z.string().datetime(),
  block_time: z.number().min(0),
  day_landings: z.number().int().min(0),
  night_landings: z.number().int().min(0),
  type_of_flight: z.string().max(50).nullable(),
  approach_type: z.string().max(50).nullable(),
  pic_time: z.number().min(0),
  sic_time: z.number().min(0),
  picus_time: z.number().min(0),
  dual_time: z.number().min(0),
  ifr_simulated_hood_time: z.number().min(0),
  cross_country_time: z.number().min(0),
  relief_pilot_time: z.number().min(0),
  simulator_time: z.number().min(0),
  instructor_time: z.number().min(0),
  multi_pilot_time: z.number().min(0),
  night_time: z.number().min(0),
  ifr_time: z.number().min(0),
  ifr_actual_imc_time: z.number().min(0),
  signature: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

//
//
//
//
//Update everything ot the new zod schema, command to fetch airports and store in the db
//
//
//
//

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
