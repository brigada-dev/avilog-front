import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, differenceInMinutes, addDays, isBefore, parse } from 'date-fns';
import { Button } from '~/components/Button';
import AdjustModal from '~/components/AdjustModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFlights, createFlight, FlightFormData } from '~/api/flights';
import { useAuth } from '~/context/auth-context';
import { Dropdown } from 'react-native-element-dropdown';

const flightSchema = z.object({
  registration: z.string().min(1, 'Registration is required'),
  type: z.string().min(1, 'Aircraft type is required'),
  from: z.string().min(1, 'Departure airport is required'),
  to: z.string().min(1, 'Arrival airport is required'),
  depDate: z.date(),
  arrDate: z.date(),
  depTime: z.date(),
  arrTime: z.date(),
  duration: z.string(),
  aircraft: z.object({
    type: z.string(),
    imageUrl: z.string().nullable(),
    flightTime: z.string(),
    flights: z.number(),
  }),
  crew: z.object({
    sic: z.string(),
    pic: z.string(),
  }),
  summary: z.object({
    total: z.string(),
    sic: z.string(),
    mp: z.string(),
    ifr: z.string(),
    xc: z.string(),
  }),
});

export default function CreateFlight() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isAdjustModalVisible, setAdjustModalVisible] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: FlightFormData) => createFlight(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
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
      registration: '',
      type: '',
      from: '',
      to: '',
      depDate: new Date(),
      arrDate: new Date(),
      depTime: new Date(),
      arrTime: new Date(),
      duration: '0:00',
      aircraft: { type: '', imageUrl: null, flightTime: '0:00', flights: 0 },
      crew: { sic: '', pic: '' },
      summary: { total: '0:00', sic: '0:00', mp: '0:00', ifr: '0:00', xc: '0:00' },
    },
  });

  const depTime = watch('depTime');
  const arrTime = watch('arrTime');

  const handleTimeChange = (selectedDate: Date | undefined, type: 'depTime' | 'arrTime') => {
    if (!selectedDate) return;
    setValue(type, selectedDate);

    if (type === 'arrTime' && isBefore(selectedDate, depTime)) {
      setValue('depDate', addDays(watch('depDate'), 1));
    }

    const diff = differenceInMinutes(watch('arrTime'), watch('depTime'));
    const adjustedDiff = diff < 0 ? diff + 1440 : diff;
    const hours = Math.floor(adjustedDiff / 60);
    const minutes = adjustedDiff % 60;
    setValue('duration', `${hours}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleSaveFlight = async (data: FlightFormData) => {
    mutation.mutate(data);
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

            <View className="mt-2 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
              <Controller
                control={control}
                name="depDate"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, d) => setValue('depDate', d || value)}
                  />
                )}
              />
              <View className="h-full w-px bg-black/10" />
              <Controller
                control={control}
                name="arrDate"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, d) => setValue('arrDate', d || value)}
                  />
                )}
              />
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 32, width: 32 }}
              />
              <Controller
                control={control}
                name="from"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="text-lg font-medium"
                    placeholder="From"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Controller
                  control={control}
                  name="from"
                  render={({ field: { onChange, value = '' } }) => (
                    <View style={{ marginBottom: 10 }}>
                      <Text className="mb-2 italic text-gray-600">Standard Style</Text>
                      <Dropdown
                        style={{
                          borderRadius: 8,
                          justifyContent: 'center', // Centers text inside
                          backgroundColor: 'white', // Ensures visibility
                        }}
                        containerStyle={{
                          borderRadius: 16,
                          shadowOffset: { width: 0, height: 0 },
                          overflow: 'hidden',
                        }}
                        placeholderStyle={{
                          color: 'gray',
                          fontSize: 16,
                        }}
                        selectedTextStyle={{
                          color: 'black',
                          fontSize: 16,
                          paddingTop: 10,
                        }}
                        data={}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Standard Style"
                        value={value}
                        onChange={(item) => {
                          onChange(item.value);
                          setValue('from',item.value)
                        }}
                        renderItem={(item, selected) => (
                          <View
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 10,
                              backgroundColor: selected ? '#ddd' : 'white',
                            }}>
                            <Text style={{ fontSize: 16 }}>{item.label}</Text>
                          </View>
                        )}
                      />
                    </View>
                  )}
                />
                {errors.from && (
                  <Text className="text-red-500">{errors.from.message}</Text>
                )}
              </View>

              {/* <Image
                source={{ uri: flight.depFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              
              <Image source={require('../../../assets/images/paper-plane.png')} />

              <Image
                source={{ uri: flight.arrFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              /> */}

              {/* <TextInput
                value={flight.to}
                className="flex-1 text-lg font-medium"
                onChangeText={(text) => setValue('to', text)}
              /> */}
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 36, width: 36 }}
              />
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
              <DateTimePicker
                value={depTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, d) => handleTimeChange(d, 'depTime')}
              />
              {/* <Text className="text-xs text-green-600">{flight.timezone}</Text>
              <Text className="text-lg font-medium">{duration}</Text>
              <Text className="text-xs text-green-600">{flight.timezone}</Text> */}
              <DateTimePicker
                value={arrTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, d) => handleTimeChange(d, 'arrTime')}
              />
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
            </View>
          </View>
          <View className="mt-6 flex-1 overflow-hidden rounded-xl border border-[#DBDADA] bg-white">
            <View className="flex-row">
              <View className="flex-1">
                {/* {flight.aircraft.imageUrl ? (
                  <Image source={{ uri: flight.aircraft.imageUrl }} style={{ height: 128 }} />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                      <Image
                        source={require('../../../assets/images/image_placeholder.png')}
                        style={{ height: 80, width: 80 }}
                      />
                    </View>
                  </View>
                )} */}
              </View>
              <View className="flex-1 p-4">
                <View>
                  {/* <Text className="text-lg font-bold">{flight.registration}</Text>
                  <TextInput
                    value={flight.aircraft.type}
                    className="text-lg font-medium"
                    onChangeText={(text) => handleInputChange('type', text, 'aircraft')} // Nested field
                  /> */}
                </View>
                <View className="flex flex-row gap-2 pt-2">
                  <View className="flex-row items-center">
                    <Image
                      source={require('../../../assets/images/clock.png')}
                      style={{ height: 24, width: 24 }}
                    />
                    {/* <Text className="text-sm font-bold">{flight.aircraft.flightTime}</Text> */}
                  </View>
                  <View className="flex-row items-center">
                    <Image
                      source={require('../../../assets/images/landing.png')}
                      style={{ height: 24, width: 24 }}
                    />
                    {/* <Text className="text-sm font-bold">{flight.aircraft.flights}</Text> */}
                  </View>
                </View>
              </View>
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
                    {/* <TextInput className="text-center text-xl" value={flight.type} /> */}
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

          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="mt-2">
              <Text>Crew</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
                <Text className="text-base font-medium">SIC</Text>
              </TouchableOpacity>
              {/* <TextInput className="text-base" value={flight.crew.sic} /> */}
              <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
            </View>
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
                <Text className="text-base font-medium">PIC</Text>
              </TouchableOpacity>
              {/* <TextInput className="text-base" value={flight.crew.pic} /> */}
              <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
            </View>
            <Button
              title="Add crew"
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

          <View className="mt-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-semibold">Summary</Text>
            <View className="mt-2 flex-row flex-wrap gap-4">
              {/* {Object.entries(flight.summary).map(([key, value]) => (
                <View
                  key={key}
                  className="aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                  <Text className="text-base font-bold">{value}</Text>
                  <Text className="text-xs text-gray-500">{key.toUpperCase()}</Text>
                </View>
              ))} */}
            </View>
            <View className="mt-3 h-px w-full bg-black/10" />
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
          </View>
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
      <AdjustModal
        visible={isAdjustModalVisible}
        onClose={() => setAdjustModalVisible(false)}
        flightSummary={watch('summary')}
      />
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
