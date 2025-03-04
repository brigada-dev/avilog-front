import { api } from "./api";

export type FlightType = {
  id: number;
  name: string;
};

export const fetchFlightTypes = async (token?: string): Promise<FlightType[]> => {
  const response = await api("/flight-types", token);
  return response.data;
};

export const createFlightType = async (name: string, token?: string): Promise<FlightType> => {
  const response = await api("/flight-types", token, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return response.data;
};

export const deleteFlightType = async (id: number, token?: string): Promise<void> => {
  await api(`/flight-types/${id}`, token, { method: "DELETE" });
};
