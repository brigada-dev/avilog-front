import React from 'react';
import { useAuth } from '../context/auth-context';
import { useSegments, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const sharedRoutes = ['(auth)', 'sign-in', 'sign-up'];
  const currentGroup = segments[0];
  const isSharedRoute = sharedRoutes.includes(currentGroup);
  const inAuthGroup = currentGroup === '(auth)';

  React.useEffect(() => {
    if (loading) return;
    if (!token && !inAuthGroup) {
      router.replace('/sign-in');
      return;
    }

    if (token && inAuthGroup) {
      router.replace('/(pilot)');
      return;
    }

    if (token && isSharedRoute) {
      return;
    }
  }, [token, segments, loading, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}
