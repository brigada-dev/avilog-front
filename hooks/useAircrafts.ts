import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '~/context/auth-context';
import { fetchAircrafts, Aircraft } from '~/api/aircrafts';
import { useMemo } from 'react';

export function useAircrafts(searchQuery: string = '') {
  const { token } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['aircrafts', searchQuery, token],
    queryFn: ({ pageParam = 1 }) => {
      return fetchAircrafts(pageParam, searchQuery, token || undefined, 20);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      
      const currentPage = lastPage.current_page || lastPage.meta?.current_page;
      const lastPageNum = lastPage.last_page || lastPage.meta?.last_page;
      
      if (currentPage && lastPageNum && currentPage < lastPageNum) {
        return currentPage + 1;
      }
      
      if (lastPage.data?.length === 20) {
        return pages.length + 1;
      }
      
      return undefined;
    },
  });

  const aircrafts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total ?? 0;
  }, [data]);

  return {
    aircrafts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalCount,
    pages: data?.pages,
  };
} 