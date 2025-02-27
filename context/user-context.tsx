import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserSettings = {
  standard_style: "ICAO" | "FAA" | "EASA" | "CAA" | "DGCA"; // ✅ Store as a string
  updateStandard: (newStandard: "ICAO" | "FAA" | "EASA" | "CAA" | "DGCA") => void;
};

const UserContext = createContext<UserSettings | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [standard_style, setStandardStyle] = useState<"ICAO" | "FAA" | "EASA" | "CAA" | "DGCA">("ICAO");

  useEffect(() => {
    const loadSettings = async () => {
      const savedStandard = await AsyncStorage.getItem("userStandard");
      if (savedStandard) {
        setStandardStyle(savedStandard as "ICAO" | "FAA" | "EASA" | "CAA" | "DGCA");
      }
    };
    loadSettings();
  }, []);

  const updateStandard = async (newStandard: "ICAO" | "FAA" | "EASA" | "CAA" | "DGCA") => {
    setStandardStyle(newStandard);
    await AsyncStorage.setItem("userStandard", newStandard); // ✅ Store as a single string
  };

  return (
    <UserContext.Provider value={{ standard_style, updateStandard }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserSettings must be used within a UserProvider");
  }
  return context;
};
