import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Aircraft } from '~/api/aircrafts';

type AircraftContextType = {
  selectedAircraft: Aircraft | null;
  setSelectedAircraft: (aircraft: Aircraft) => void;
};

const AircraftContext = createContext<AircraftContextType | undefined>(undefined);

export const AircraftProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  return (
    <AircraftContext.Provider value={{ selectedAircraft, setSelectedAircraft }}>
      {children}
    </AircraftContext.Provider>
  );
};

// Custom hook to use the context
export const useAircraftContext = () => {
  const context = useContext(AircraftContext);
  if (!context) {
    throw new Error('useAircraftContext must be used within an AircraftProvider');
  }
  return context;
};
