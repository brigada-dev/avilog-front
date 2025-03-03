import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInMinutes } from 'date-fns';
import { Button } from '~/components/Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFlight, fetchFlights, FlightFormData, flightSchema } from '~/api/flights';
import { useAuth } from '~/context/auth-context';
import { fetchAircrafts } from '~/api/aircrafts';
import { AirportSelectionSheet } from '~/components/airport/airport-selection-sheet';
import { AircraftCard } from '~/components/aircraft/AircraftCard';

export default function CreateFlight() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [selectedAircraft, setSelectedAircraft] = useState<number | null>(null);
  const [departureAirport, setDepartureAirport] = useState<string | null>();
  const [arrivalAirport, setArrivalAirport] = useState<string | null>();

  // const { data: flights, isLoading: isFlightsLoading } = useQuery({
  //   queryKey: ['flights'],
  //   queryFn: () => fetchFlights(token!),
  // });

  const { data: aircrafts, isLoading: isAircraftLoading } = useQuery({
    queryKey: ['aircrafts'],
    queryFn: () => fetchAircrafts(token!),
  });

  const mutation = useMutation({
    mutationFn: (data: FlightFormData) => createFlight(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => console.log(error),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      aircraft_id: undefined,
      departure_airport_id: undefined,
      arrival_airport_id: undefined,
      departure_date_time: new Date().toISOString(),
      arrival_date_time: new Date().toISOString(),
      day_landings: 0,
      night_landings: 0,
      type_of_flight: null,
      approach_type: '',
    },
  });

  const depTime = watch('departure_date_time');
  const arrTime = watch('arrival_date_time');

  const minutesToHours = (minutes: number) => {
    if (minutes < 0) return '0:00';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSaveFlight = async (data: FlightFormData) => {
    if (!selectedAircraft) {
      alert('Please select an aircraft');
      return;
    }
    mutation.mutate({ ...data, aircraft_id: selectedAircraft });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title="Create Flight" />

        <ScrollView>
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="mt-2 flex-row items-center gap-2">
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
              <View>
                <Controller
                  control={control}
                  name="departure_date_time"
                  render={({ field: { value } }) => (
                    <DateTimePicker
                      value={new Date(value)}
                      mode="date"
                      display="default"
                      accentColor="#23D013"
                      themeVariant="light"
                      onChange={(e, d) => {
                        if (d) {
                          setValue('departure_date_time', d.toISOString());
                        }
                      }}
                    />
                  )}
                />
              </View>
              <View className="h-full w-px bg-black/10" />
              <View>
                <Controller
                  control={control}
                  name="arrival_date_time"
                  render={({ field: { value } }) => (
                    <DateTimePicker
                      value={new Date(value)}
                      mode="date"
                      display="default"
                      accentColor="#23D013"
                      themeVariant="light"
                      onChange={(e, d) => {
                        if (d) {
                          setValue('arrival_date_time', d.toISOString());
                        }
                      }}
                    />
                  )}
                />
              </View>
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
            </View>
            <View className="mt-4 flex-row items-center justify-between gap-1">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="departure_airport_id"
                  render={({ field: { onChange, value } }) => (
                    <AirportSelectionSheet
                      value={value}
                      onChange={onChange}
                      setDepartureAirport={setDepartureAirport}
                    />
                  )}
                />
              </View>
              {departureAirport && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${departureAirport}.png`,
                  }}
                  style={{ width: 32, height: 24, borderRadius: 6 }}
                />
              )}
              <Image
                source={require('../../../assets/images/paper-plane.png')}
                style={{ height: 32, width: 32 }}
              />
              {arrivalAirport && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${arrivalAirport}.png`,
                  }}
                  style={{ width: 32, height: 24, borderRadius: 6 }}
                />
              )}
              <View className="flex-1">
                <Controller
                  control={control}
                  name="arrival_airport_id"
                  render={({ field: { onChange, value } }) => (
                    <AirportSelectionSheet
                      value={value}
                      onChange={onChange}
                      setArrivalAirport={setArrivalAirport}
                    />
                  )}
                />
              </View>

              {errors.departure_airport_id && (
                <Text className="text-red-500">{errors.departure_airport_id.message}</Text>
              )}
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
              <Controller
                control={control}
                name="departure_date_time"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={new Date(value)}
                    mode="time"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, t) => {
                      if (t) {
                        const updatedDate = new Date(value);
                        updatedDate.setHours(t.getHours(), t.getMinutes());
                        setValue('departure_date_time', updatedDate.toISOString());
                      }
                    }}
                  />
                )}
              />
              <Text className="text-xs text-green-600">UTC</Text>
              <Text className="text-lg font-medium">
                {minutesToHours(differenceInMinutes(arrTime, depTime))}
              </Text>
              <Text className="text-xs text-green-600">UTC</Text>
              <Controller
                control={control}
                name="arrival_date_time"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={new Date(value)}
                    mode="time"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, t) => {
                      if (t) {
                        const updatedDate = new Date(value);
                        updatedDate.setHours(t.getHours(), t.getMinutes());
                        setValue('arrival_date_time', updatedDate.toISOString());
                      }
                    }}
                  />
                )}
              />
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
            </View>
          </View>

          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="mb-4 rounded-xl">
              <Text className="mb-2 text-base font-normal">Aircraft</Text>
              <Controller
                control={control}
                name="aircraft_id"
                render={({ field: { value, onChange } }) => (
                  <FlatList
                    horizontal
                    data={aircrafts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`mx-1 rounded-xl border p-2 ${
                          value === item.id ? 'border-2 border-green-600' : 'border-black/10'
                        }`}
                        onPress={() => onChange(item.id)}>
                        <AircraftCard
                          registration={item.registration}
                          type={item.type}
                          image_url={item.image_url}
                        />
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              />
              {errors.aircraft_id && (
                <Text className="text-red-500">{errors.aircraft_id.message}</Text>
              )}
            </View>

            <View className="mt-2 h-px w-full bg-black/10" />
            <View className="p-2">
              <Text>Departure</Text>
              <View className="flex-row items-center justify-around">
                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Day</Text>
                  <View className="flex-row items-center justify-between gap-2">
                    <Feather name="plus-circle" size={42} color="#23d013" />
                    <Text className="text-xl font-bold">1</Text>
                    <Feather name="minus-circle" size={42} color="#23d013" />
                  </View>
                </View>
                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Night</Text>
                  <View className="flex-row items-center justify-between gap-2">
                    <Feather name="plus-circle" size={42} color="#23d013" />
                    <Text className="text-xl font-bold">0</Text>
                    <Feather name="minus-circle" size={42} color="#23d013" />
                  </View>
                </View>
              </View>
              <View className="mt-2 rounded-xl border border-black/10">
                <View className="border-b border-black/10 p-2">
                  <Text>Type of flight</Text>
                  <View className="justify-center">
                    <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
                    <Controller
                      control={control}
                      name="type_of_flight"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="text-center text-xl"
                          value={value ?? ''}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {errors.type_of_flight && (
                      <Text className="text-red-500">{errors.type_of_flight.message}</Text>
                    )}
                  </View>
                </View>
                <View className="mt-2">
                  <View className="border-b border-black/10 p-2">
                    <Text>Landing</Text>
                    <View className="justify-center">
                      <Ionicons
                        name="list"
                        size={24}
                        color="#23D013"
                        className="absolute right-2"
                      />
                      {/* <TextInput className="text-center text-xl" value={flight.approachType} /> */}
                    </View>
                  </View>
                </View>
                <View className="mt-2 flex-row items-center justify-around pb-2">
                  <View className="flex-col items-center">
                    <Text className="text-lg font-bold">Day</Text>
                    <View className="flex-row items-center justify-between gap-2">
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      <Text className="text-xl font-bold">1</Text>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </View>
                  </View>
                  <View className="mt-2 h-full w-px bg-black/10" />

                  <View className="flex-col items-center">
                    <Text className="text-lg font-bold">Night</Text>
                    <View className="flex-row items-center justify-between gap-2">
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      <Text className="text-xl font-bold">0</Text>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* <View className="mt-2 flex-row items-center gap-4">
            <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
              <Text className="text-base font-medium">SIC</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name=""
              render={({ field: { onChange, value } }) => (
                <TextInput className="flex-1 text-base" value={value} onChangeText={onChange} />
              )}
            />
            {errors.crew?.sic && <Text className="text-red-500">{errors.crew.sic.message}</Text>}
          </View>

          <View className="mt-2 flex-row items-center gap-4">
            <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
              <Text className="text-base font-medium">PIC</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="crew.pic"
              render={({ field: { onChange, value } }) => (
                <TextInput className="flex-1 text-base" value={value} onChangeText={onChange} />
              )}
            />
            {errors.crew?.pic && <Text className="text-red-500">{errors.crew.pic.message}</Text>}
          </View>

          <View className="mt-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-semibold">Summary</Text>
            <Controller
              control={control}
              name="summary.total"
              render={({ field: { onChange, value } }) => (
                <View className="aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                  <Text className="text-base font-bold">{value}</Text>
                  <Text className="text-xs text-gray-500">TOTAL</Text>
                </View>
              )}
            />
            <Controller
              control={control}
              name="summary.ifr"
              render={({ field: { onChange, value } }) => (
                <View className="aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                  <Text className="text-base font-bold">{value}</Text>
                  <Text className="text-xs text-gray-500">IFR</Text>
                </View>
              )}
            /> <View className="mt-3 h-px w-full bg-black/10" />
            <Button
              title="Adjust"
              iconLeft={require('../../../assets/images/edit.png')}
              onPress={() => setAdjustModalVisible(true)}
              style={{
                borderRadius: 16,
                borderColor: '#C4C4C4',
                borderWidth: 1,
                width: 'auto',
                marginTop: 12,
              }}
            />
          </View> */}
          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="mt-2 flex-row flex-wrap gap-4">
              <TextInput className="flex-1 py-2 font-bold text-gray-800" />
            </View>
            <View className="mt-3 h-px w-full bg-black/10" />
            <Button
              title="Signature"
              iconLeft={require('../../../assets/images/edit.png')}
              style={{
                borderRadius: 16,
                borderColor: '#C4C4C4',
                borderWidth: 1,
                width: 'auto',
                marginTop: 12,
              }}
            />
          </View>
          <View className="mb-6 mt-6 items-center">
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(handleSaveFlight)}>
              <Ionicons name="airplane-outline" size={24} color="white" />
              <Text style={styles.saveButtonText}>Create Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
      {/* <AdjustModal
        visible={isAdjustModalVisible}
        onClose={() => setAdjustModalVisible(false)}
        flightSummary={watch('summary')}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  icon: { height: 32, width: 32 },
  smallIcon: { height: 24, width: 24 },
  flag: { height: 24, width: 24, borderRadius: 60 },
  saveButton: {
    backgroundColor: '#2ED013',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
