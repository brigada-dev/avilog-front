import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Flight } from '~/api/flights';

type FlightContextType = {
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  updateSelectedFlight: (updates: Partial<Flight>) => void;
};

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const FlightProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const updateSelectedFlight = (updates: Partial<Flight>) => {
    setSelectedFlight((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight, updateSelectedFlight }}>
      {children}
    </FlightContext.Provider>
  );
};

// Custom hook to use the context
export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error('useFlightContext must be used within a FlightProvider');
  }
  return context;
}; 