import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '~/context/auth-context';
import { useUserSettings } from '~/context/user-context';
import { fetchAirports, Airport } from '~/api/airports';
import { useMemo } from 'react';

export function useAirports(searchQuery: string = '') {
  const { token } = useAuth();
  const { standard_style } = useUserSettings();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['airports', searchQuery, standard_style, token],
    queryFn: ({ pageParam = 1 }) => fetchAirports(pageParam, searchQuery, standard_style, token || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
  });

  const airports = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total ?? 0;
  }, [data]);

  return {
    airports,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalCount,
  };
} 