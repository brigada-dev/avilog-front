import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '~/context/auth-context';
import { fetchFlights, Flight } from '~/api/flights';
import { useMemo } from 'react';
import { api } from '~/api/api';

// Function to fetch flights with pagination
const fetchFlightsWithPagination = async (
  page: number = 1,
  searchQuery: string = '',
  token?: string,
  perPage: number = 20
): Promise<{
  data: Flight[];
  current_page: number;
  last_page: number;
  total: number;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('per_page', perPage.toString());
  
  if (searchQuery) {
    queryParams.append('search', searchQuery);
  }
  
  const response = await api(`/flights?${queryParams.toString()}`, token);
  return response;
};

export function useFlights(searchQuery: string = '') {
  const { token } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['flights', searchQuery, token],
    queryFn: ({ pageParam = 1 }) => {
      return fetchFlightsWithPagination(pageParam, searchQuery, token || undefined, 50);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      
      const currentPage = lastPage.current_page || lastPage.meta?.current_page;
      const lastPageNum = lastPage.last_page || lastPage.meta?.last_page;
      
      if (currentPage && lastPageNum && currentPage < lastPageNum) {
        return currentPage + 1;
      }
      
      if (lastPage.data?.length === 50) {
        return pages.length + 1;
      }
      
      return undefined;
    },
  });

  const flights = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total ?? 0;
  }, [data]);

  return {
    flights,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalCount,
    pages: data?.pages,
  };
} 