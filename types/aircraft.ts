export interface Aircraft {
  id: number;
  registration: string;
  type: string;
  engine_type: 'Glider' | 'Turboprop' | 'Piston' | 'Jet';
  is_multi_engine: boolean;
  is_multi_pilot: boolean;
  is_simulator: boolean;
  is_aircraft: boolean;
  remarks?: string;
  image_url?: string;
  flight_time: number;
  landings: number;
  created_by_user: boolean;
  user_id?: number;
  created_at: string;
  updated_at: string;
} 