export type Airport = {
  id: number;
  name: string;
  icao: string;
  iata?: string;
  faa?: string;
  easa?: string;
  country: string;
};

export interface FlightRoute {
  id: string;
  origin: Airport;
  destination: Airport;
}
