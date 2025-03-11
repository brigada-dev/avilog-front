import { format } from 'date-fns';
import { Link } from 'expo-router';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Flight, fetchFlights } from '~/api/flights';
import { differenceInMinutes, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '~/context/auth-context';

const calculateDuration = (departure: string, arrival: string): string => {
  const depTime = parseISO(departure);
  const arrTime = parseISO(arrival);

  const diffMinutes = differenceInMinutes(arrTime, depTime);

  if (diffMinutes < 0) return '00:00'; // Safety check for invalid times

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

type FlightEntriesProps = {
  limit?: number;
};

export function FlightEntries({ limit = 5 }: FlightEntriesProps) {
  const { token } = useAuth();
  
  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['recent-flights', limit],
    queryFn: () => fetchFlights(token!, limit),
  });

  if (isLoading) {
    return (
      <View className="flex items-center justify-center py-4">
        <ActivityIndicator size="large" color="#2B9C1A" />
      </View>
    );
  }

  if (error || !flights) {
    return (
      <View className="flex items-center justify-center py-4">
        <Text className="text-red-500">Failed to load recent flights</Text>
      </View>
    );
  }

  if (flights.length === 0) {
    return (
      <View className="flex items-center justify-center py-4">
        <Text className="text-gray-500">No flights found</Text>
      </View>
    );
  }

  const renderFlightCard = ({ item }: { item: Flight }) => {
    return (
      <Link href={`/(pilot)/flights/${item.id}`} asChild>
        <TouchableOpacity>
          <View className="flex-1 flex-row items-center justify-between">
            <View className="w-full flex-1 flex-col items-center p-2">
              <View className="flex flex-row items-center justify-between gap-3">
                <Image
                  source={require('../assets/plane-icon.png')}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text className="text-base font-medium">{item.aircraft_registration}</Text>
              </View>
              <View className="flex flex-row items-center justify-between gap-2">
                <Image
                  source={{ uri: `https://flagcdn.com/w40/${item.departure_country_iso}.png` }}
                  className="mr-2 h-7 w-10"
                />
                <View className="flex items-center justify-center rounded-md border border-black px-2">
                  <Text className="text-xs font-normal">
                    {format(item.departure_date_time, 'HH:mm')}
                  </Text>
                  <Text className="text-sm font-bold text-black">{item.departure_airport_code ?? 'N/A'}</Text>
                </View>
              </View>
            </View>

            <View className="flex-col items-center">
              <Text className="mx-2 text-xl font-medium">{item.type_of_flight}</Text>
              <Text className="mx-2 text-3xl font-bold">{calculateDuration(item.departure_date_time, item.arrival_date_time)}</Text>
            </View>

            <View className="w-full flex-1 flex-col items-center p-2">
              <View className="flex flex-row items-center justify-between gap-3">
                <Text className="text-base font-medium">
                  {format(item.arrival_date_time, 'dd/MM/yy')}
                </Text>
                <Image
                  source={require('../assets/images/calendar.png')}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
              </View>
              <View className="flex flex-row items-center justify-between gap-2">
                <View className="flex items-center justify-center rounded-md border border-black px-2">
                  <Text className="text-xs font-normal">
                    {format(item.arrival_date_time, 'HH:mm')}
                  </Text>
                  <Text className="text-sm font-bold text-black">{item.arrival_airport_code ?? 'N/A'}</Text>
                </View>
                <Image source={{ uri: `https://flagcdn.com/w40/${item.arrival_country_iso}.png` }} className="h-7 w-10" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <FlatList
      scrollEnabled={false}
      renderItem={renderFlightCard}
      data={flights}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ flex: 1 }}
      ItemSeparatorComponent={() => (
        <View
          style={{ height: 1, width: 240, marginHorizontal: 'auto', backgroundColor: '#DBDADA' }}
        />
      )}
    />
  );
}
