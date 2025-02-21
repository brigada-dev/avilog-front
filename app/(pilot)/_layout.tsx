import { Stack } from 'expo-router';

export default function PilotLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="logbook" options={{headerShown: false}}/>
        <Stack.Screen name="crew" options={{headerShown: false}} />
        <Stack.Screen name="add-aircraft" options={{headerShown: false}} />
        <Stack.Screen name="aircrafts" options={{headerShown: false}} />
        <Stack.Screen name="airports" options={{headerShown: false}} />
        <Stack.Screen name="maps" options={{headerShown: false}} />
        <Stack.Screen name="monthly" options={{headerShown: false}} />
        <Stack.Screen name="profile" options={{headerShown: false}} />
        <Stack.Screen name="time" options={{headerShown: false}} />
        <Stack.Screen name="total_time" options={{headerShown: false}} />
        <Stack.Screen name="aircraft/[id]" options={{headerShown: false}} />
        <Stack.Screen name="aircraft/edit/[id]" options={{headerShown: false}} />
      </Stack>
  );
}
