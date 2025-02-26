import '../global.css';
import 'expo-dev-client';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthMiddleware } from '~/context/auth-middleware';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthMiddleware>
          <Stack>
            <Stack.Screen name="(pilot)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </AuthMiddleware>
      </AuthProvider>
    </QueryClientProvider>
  );
}
