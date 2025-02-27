export const airportNames: Record<
  string,
  Record<'ICAO' | 'FAA' | 'EASA' | 'CAA' | 'DGCA', string>
> = {
  'London Heathrow': { ICAO: 'EGLL', FAA: 'EGLL', EASA: 'EGLL', CAA: 'EGLL', DGCA: 'EGLL' },
  'Paris Charles de Gaulle': { ICAO: 'LFPG', FAA: 'LFPG', EASA: 'LFPG', CAA: 'LFPG', DGCA: 'LFPG' },
  'Frankfurt Airport': { ICAO: 'EDDF', FAA: 'EDDF', EASA: 'EDDF', CAA: 'EDDF', DGCA: 'EDDF' },
  'New York JFK': { ICAO: 'KJFK', FAA: 'JFK', EASA: 'KJFK', CAA: 'KJFK', DGCA: 'KJFK' },
  'Los Angeles International': {
    ICAO: 'KLAX',
    FAA: 'LAX',
    EASA: 'KLAX',
    CAA: 'KLAX',
    DGCA: 'KLAX',
  },
  'Dubai International': { ICAO: 'OMDB', FAA: 'OMDB', EASA: 'OMDB', CAA: 'OMDB', DGCA: 'OMDB' },
  'Tokyo Haneda': { ICAO: 'RJTT', FAA: 'RJTT', EASA: 'RJTT', CAA: 'RJTT', DGCA: 'RJTT' },
  'Mumbai Chhatrapati Shivaji': {
    ICAO: 'VABB',
    FAA: 'VABB',
    EASA: 'VABB',
    CAA: 'VABB',
    DGCA: 'DGCA - VABB',
  },
  'Delhi Indira Gandhi': {
    ICAO: 'VIDP',
    FAA: 'VIDP',
    EASA: 'VIDP',
    CAA: 'VIDP',
    DGCA: 'DGCA - VIDP',
  },
};

export type AirportName = keyof typeof airportNames;

export const getAirportNaming = (
  airport: AirportName, // ✅ Now only accepts known airport names
  standard: "ICAO" | "FAA" | "EASA" | "CAA" | "DGCA"
): string => {
  return airportNames[airport][standard];
};
