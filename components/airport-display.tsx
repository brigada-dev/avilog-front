import React from "react";
import { Text } from "react-native";
import { useUserSettings } from "~/context/user-context";
import { getAirportNaming } from "~/api/standards";

type AirportDisplayProps = {
  airport: string;
};

export const AirportDisplay: React.FC<AirportDisplayProps> = ({ airport }) => {
  const { standard_style } = useUserSettings();

  return <Text>{getAirportNaming(airport, standard_style)}</Text>;
};
