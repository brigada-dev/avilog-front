import React, { useRef, useState } from 'react';
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
  ActivityIndicator,
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
import { createFlight, FlightFormData, flightSchema } from '~/api/flights';
import { useAuth } from '~/context/auth-context';
import { fetchAircrafts } from '~/api/aircrafts';
import { AirportSelectionSheet } from '~/components/airport/airport-selection-sheet';
import { AircraftCard } from '~/components/aircraft/AircraftCard';
import { CrewRole, fetchCrewRoles } from '~/api/crews';
import { CrewEditSheet } from '~/components/crew/crew-edit-sheet';
import { CrewForm } from '~/components/crew/crew-form';
import { CrewSelectionSheet } from '~/components/crew/crew-selection-sheet';

export default function CreateFlight() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [departureAirport, setDepartureAirport] = useState<string | null>();
  const [arrivalAirport, setArrivalAirport] = useState<string | null>();
  const [editingMember, setEditingMember] = useState<{ id: number; name: string } | null>(null);

  const { data: aircrafts, isLoading: isAircraftLoading } = useQuery({
    queryKey: ['aircrafts'],
    queryFn: () => fetchAircrafts(token!),
  });
  const {
    data: crewRoles,
    isLoading: isCrewLoading,
    error,
  } = useQuery({
    queryKey: ['crews'],
    queryFn: () => fetchCrewRoles(token!),
  });

  const mutation = useMutation({
    mutationFn: (data: FlightFormData) => createFlight(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => console.log(error),
  });

  const form = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      aircraft_id: undefined,
      departure_airport_id: undefined,
      arrival_airport_id: undefined,
      departure_date_time: new Date().toISOString(),
      arrival_date_time: new Date().toISOString(),
      departure: { day: 0, night: 0 },
      type_of_flight: null,
      approach_type: '',
      landing: { day: 0, night: 0 },
      crew: [],
      signature: '',
    },
  });

  const { width, height } = Dimensions.get('screen');

  const depTime = form.watch('departure_date_time');
  const arrTime = form.watch('arrival_date_time');
  const crewState = form.watch('crew') || [];
  const dayValue = form.watch('departure.day');
  const nightValue = form.watch('departure.night');

  const minutesToHours = (minutes: number) => {
    if (minutes < 0) return '0:00';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSaveFlight = async (data: FlightFormData) => {
    console.log(data);
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
                  control={form.control}
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
                          form.setValue('departure_date_time', d.toISOString());
                        }
                      }}
                    />
                  )}
                />
              </View>
              <View className="h-full w-px bg-black/10" />
              <View>
                <Controller
                  control={form.control}
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
                          form.setValue('arrival_date_time', d.toISOString());
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
                  control={form.control}
                  name="departure_airport_id"
                  render={({ field: { onChange, value } }) =>
                    isAircraftLoading ? (
                      <ActivityIndicator style={{ backgroundColor: 'green' }} />
                    ) : (
                      <AirportSelectionSheet
                        value={value}
                        onChange={onChange}
                        setDepartureAirport={setDepartureAirport}
                      />
                    )
                  }
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
                  control={form.control}
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

              {form.formState.errors.departure_airport_id && (
                <Text className="text-red-500">
                  {form.formState.errors.departure_airport_id.message}
                </Text>
              )}
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
              <Controller
                control={form.control}
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
                        form.setValue('departure_date_time', updatedDate.toISOString());
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
                control={form.control}
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
                        form.setValue('arrival_date_time', updatedDate.toISOString());
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
                control={form.control}
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
              {form.formState.errors.aircraft_id && (
                <Text className="text-red-500">{form.formState.errors.aircraft_id.message}</Text>
              )}
            </View>

            <View className="mt-2 h-px w-full bg-black/10" />
            <View className="p-2">
              <Text>Departure</Text>
              <View className="mt-2 flex-row items-center justify-around pb-2">
                {/* Day Counter */}
                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Day</Text>
                  <View
                    className="flex-row items-center justify-between gap-2"
                    style={{ width: width * 0.5 - 80 }}>
                    <TouchableOpacity
                      onPress={() => form.setValue('departure.day', Math.max(0, dayValue - 1))}>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                    <Controller
                      control={form.control}
                      name="departure.day"
                      render={({ field }) => (
                        <Text className="shrink-0 text-xl font-bold">{field.value}</Text>
                      )}
                    />
                    <TouchableOpacity onPress={() => form.setValue('departure.day', dayValue + 1)}>
                      <Feather name="plus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mt-2 h-full w-px bg-black/10" />

                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Night</Text>
                  <View
                    className="flex-row items-center justify-between gap-2"
                    style={{ width: width * 0.5 - 80 }}>
                    <TouchableOpacity
                      onPress={() => form.setValue('departure.night', Math.max(0, nightValue - 1))}>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                    <Controller
                      control={form.control}
                      name="departure.night"
                      render={({ field }) => (
                        <Text className="text-xl font-bold">{field.value}</Text>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => form.setValue('departure.night', nightValue + 1)}>
                      <Feather name="plus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="mt-2 rounded-xl border border-black/10">
                <View className="mt-2">
                  <View className="border-b border-black/10 p-2">
                    <Text>Landing</Text>
                    <Ionicons
                      name="list"
                      size={32}
                      color="#23D013"
                      className="absolute right-3 top-3"
                    />
                    <View className="justify-center">
                      <TextInput className="text-center text-xl" />
                    </View>
                  </View>
                </View>
                <View className="mt-2 flex-row items-center justify-around pb-2">
                  <View className="flex-col items-center" style={{ width: width * 0.5 - 80 }}>
                    <Text className="text-lg font-bold">Day</Text>
                    <View className="flex-row items-center justify-between gap-2">
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      <Text className="text-xl font-bold">1</Text>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </View>
                  </View>
                  <View className="mt-2 h-full w-px bg-black/10" />
                  <View className="flex-col items-center" style={{ width: width * 0.5 - 80 }}>
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
          <View className="mt-4 rounded-xl bg-white p-4">
            <CrewForm crewState={crewState} crewRoles={crewRoles!} form={form} />
            <Controller
              control={form.control}
              name="crew"
              render={({ field: { onChange, value } }) => (
                <CrewSelectionSheet
                  value={value ?? []}
                  onChange={onChange}
                  crewRoles={crewRoles!}
                />
              )}
            />
          </View>

          {/* <View className="mt-4 rounded-xl bg-white p-4">
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
            <TouchableOpacity
              style={styles.saveButton}
              onPress={form.handleSubmit(handleSaveFlight)}>
              <Ionicons name="airplane-outline" size={24} color="white" />
              <Text style={styles.saveButtonText}>Create Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
      <CrewEditSheet member={editingMember} onClose={() => setEditingMember(null)} />
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
