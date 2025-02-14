export interface Airport {
    id: string
    name: string
    code: string
    latitude: number
    longitude: number
  }
  
  export interface FlightRoute {
    id: string
    origin: Airport
    destination: Airport
  }
  
  