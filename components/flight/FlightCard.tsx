import React from 'react';
import { View, Text, Image } from 'react-native';
import { format } from 'date-fns';
import { differenceInMinutes, parseISO } from 'date-fns';

const calculateDuration = (departure: string, arrival: string): string => {
  const depTime = parseISO(departure);
  const arrTime = parseISO(arrival);

  const diffMinutes = differenceInMinutes(arrTime, depTime);

  if (diffMinutes < 0) return '00:00'; // Safety check for invalid times

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

type FlightCardProps = {
  aircraft_registration: string;
  type_of_flight: string | null;
  departure_date_time: string;
  arrival_date_time: string;
  departure_airport_code: string;
  arrival_airport_code: string;
  departure_country_iso: string;
  arrival_country_iso: string;
  loading?: boolean;
};

export function FlightCard({
  aircraft_registration,
  type_of_flight,
  departure_date_time,
  arrival_date_time,
  departure_airport_code,
  arrival_airport_code,
  departure_country_iso,
  arrival_country_iso,
  loading
}: FlightCardProps) {
  return loading ? (
    <View className="h-24 flex-1 animate-pulse bg-black/10" />
  ) : (
    <View className="h-32 flex-1 flex-row overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
      <View className="flex-1 flex-row items-center justify-between">
        <View className="w-full flex-1 flex-col items-center">
          <View className="flex flex-row items-center justify-between gap-3">
            <Image
              source={require('../../assets/plane-icon.png')}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text className="text-base font-medium">{aircraft_registration}</Text>
          </View>
          <View className="flex flex-row items-center justify-between gap-2">
            <Image
              source={{ uri: `https://flagcdn.com/w40/${departure_country_iso}.png` }}
              className="mr-2 h-7 w-10"
            />
            <View className="flex items-center justify-center rounded-md border border-black px-2">
              <Text className="text-xs font-normal">
                {format(parseISO(departure_date_time), 'HH:mm')}
              </Text>
              <Text className="text-sm font-bold text-black">{departure_airport_code ?? 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View className="flex-col items-center">
          <Text className="mx-2 text-xl font-medium">{type_of_flight || 'N/A'}</Text>
          <Text className="mx-2 text-3xl font-bold">{calculateDuration(departure_date_time, arrival_date_time)}</Text>
        </View>

        <View className="w-full flex-1 flex-col items-center">
          <View className="flex flex-row items-center justify-between gap-3">
            <Text className="text-base font-medium">
              {format(parseISO(departure_date_time), 'dd/MM/yy')}
            </Text>
            <Image
              source={require('../../assets/images/calendar.png')}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
          </View>
          <View className="flex flex-row items-center justify-between gap-2">
            <View className="flex items-center justify-center rounded-md border border-black px-2">
              <Text className="text-xs font-normal">
                {format(parseISO(arrival_date_time), 'HH:mm')}
              </Text>
              <Text className="text-sm font-bold text-black">{arrival_airport_code ?? 'N/A'}</Text>
            </View>
            <Image 
              source={{ uri: `https://flagcdn.com/w40/${arrival_country_iso}.png` }} 
              className="h-7 w-10" 
            />
          </View>
        </View>
      </View>
    </View>
  );
} 