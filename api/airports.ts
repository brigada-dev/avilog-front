import { QueryFunction } from '@tanstack/react-query';
import { api } from './api';

export const fetchAirports: QueryFunction<any, [string, string, string, string | undefined], number> = async ({
  queryKey,
  pageParam = 1,
}) => {
  const [, search, format, token] = queryKey;

  const response = await api(
    `/airports?per_page=50&page=${pageParam}&search=${search}&format=${format}`,
    token
  );

  return {
    airports: response.data || [],
    current_page: response.meta?.current_page || 1,
    last_page: response.meta?.last_page || 1,
  };
};
