import '../global.css';
import 'expo-dev-client';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(pilot)" options={{headerShown: false}}/>
      </Stack>
    </>
  );
}
