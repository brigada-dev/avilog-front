import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/user';
import { useAuth } from '../context/auth-context';

export function useUser() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
