import '../global.css';
import 'expo-dev-client';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthMiddleware } from '~/context/auth-middleware';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { UserProvider } from '~/context/user-context';
import { AircraftProvider } from '~/context/aircraft-context';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <AuthProvider>
            <AuthMiddleware>
              <UserProvider>
                <AircraftProvider>
                  <Stack>
                    <Stack.Screen name="(pilot)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  </Stack>
                </AircraftProvider>
              </UserProvider>
            </AuthMiddleware>
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
