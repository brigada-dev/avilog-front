import { api } from "./api";

export type License = {
  id: number;
  name: string;
  expires_at: string;
};

export type LicenseFormData = {
  licenseName: string;
  expiresAt: Date;
};

export const fetchLicenses = async (token?: string): Promise<License[]> => {
  const response = await api("/licenses", token);
  return response.data;
};


export const createLicense = async (data: LicenseFormData, token?: string) => {
  return await api("/licenses", token, {
    method: "POST",
    body: JSON.stringify({
      name: data.licenseName,
      expires_at: data.expiresAt.toISOString().split("T")[0],
    }),
  });
};
