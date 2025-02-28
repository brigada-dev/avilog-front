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
import AdjustModal from '~/components/AdjustModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFlight, fetchFlights, FlightFormData, flightSchema } from '~/api/flights';
import { useAuth } from '~/context/auth-context';
import { Dropdown } from 'react-native-element-dropdown';
import { airports } from '~/lib/exports';
import { fetchAircrafts } from '~/api/aircrafts';

export default function CreateFlight() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isAdjustModalVisible, setAdjustModalVisible] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<number | null>(null);

  // Fetch flights
  const { data: flights, isLoading: isFlightsLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: () => fetchFlights(token!),
  });

  // Fetch aircrafts
  const { data: aircrafts, isLoading: isAircraftLoading } = useQuery({
    queryKey: ['aircrafts'],
    queryFn: () => fetchAircrafts(token!),
  });

  // Create Flight Mutation
  const mutation = useMutation({
    mutationFn: (data: FlightFormData) => createFlight(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => console.log(error)
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
      aircraft_id: null,
      crew: { sic: '', pic: '' },
      summary: { total: '0:00', sic: '0:00', mp: '0:00', ifr: '0:00', xc: '0:00' },
    },
  });
  console.log(errors)
  const depTime = watch('depTime');
  const arrTime = watch('arrTime');

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

  const { height, width } = Dimensions.get('screen');
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
              <View>
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
              </View>
              <View className="h-full w-px bg-black/10" />
              <View>
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
              </View>
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 32, width: 32 }}
              />
              <View className="flex-1">
                <Controller
                  control={control}
                  name="from"
                  render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                      <View className="flex-1">
                        <Dropdown
                          style={{
                            borderRadius: 8,
                            justifyContent: 'center',
                          }}
                          mode="modal"
                          search
                          inputSearchStyle={{ borderRadius: 12 }}
                          containerStyle={{
                            borderRadius: 16,
                            width: width - 30,
                            height: height - 240,
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
                          data={airports}
                          labelField="label"
                          valueField="value"
                          placeholder="From"
                          value={value}
                          onChange={(item) => {
                            onChange(item.value);
                            setValue('from', item.value);
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
                    </View>
                  )}
                />
              </View>
              <Image
                source={require('../../../assets/images/paper-plane.png')}
                style={{ height: 32, width: 32 }}
              />
              <View className="flex-1">
                <Controller
                  control={control}
                  name="to"
                  render={({ field: { onChange, value = '' } }) => (
                    <View style={{ marginBottom: 10 }}>
                      <Dropdown
                        style={{
                          borderRadius: 8,
                          justifyContent: 'center',
                        }}
                        mode="modal"
                        search
                        inputSearchStyle={{ borderRadius: 12 }}
                        containerStyle={{
                          borderRadius: 16,
                          width: width - 30,
                          height: height - 240,
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
                        data={airports}
                        labelField="label"
                        valueField="value"
                        placeholder="To"
                        value={value}
                        onChange={(item) => {
                          onChange(item.value);
                          setValue('to', item.value);
                        }}
                        renderItem={(item, selected) => (
                          <View
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 10,
                              backgroundColor: selected ? '#DBDADA' : 'white',
                            }}>
                            <Text style={{ fontSize: 16 }}>{item.label}</Text>
                          </View>
                        )}
                      />
                    </View>
                  )}
                />
              </View>
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 36, width: 36 }}
              />
              {errors.from && <Text className="text-red-500">{errors.from.message}</Text>}
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
              <Controller
                control={control}
                name="depTime"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={value}
                    mode="time"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, d) => setValue('depTime', d || value)}
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
                name="arrTime"
                render={({ field: { value } }) => (
                  <DateTimePicker
                    value={value}
                    mode="time"
                    display="default"
                    accentColor="#23D013"
                    themeVariant="light"
                    onChange={(e, d) => setValue('arrTime', d || value)}
                  />
                )}
              />
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
            </View>
            <View className="mt-6 flex-1 overflow-hidden rounded-xl border border-[#DBDADA] bg-white">
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 text-base font-normal">Select Aircraft</Text>
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
                          className={`mx-1 rounded-lg border p-2 ${
                            value === item.id ? 'border-green-600' : 'border-gray-300'
                          }`}
                          onPress={() => onChange(item.id)}>
                          <Image
                            source={
                              item.image_url
                                ? { uri: item.image_url }
                                : require('../../../assets/images/image_placeholder.png')
                            }
                            style={{ width: 80, height: 80, borderRadius: 8 }}
                          />
                          <Text className="mt-1 text-center">{item.registration}</Text>
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
                      name="type"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="text-center text-xl"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                           {errors.type && (
                            <Text className="text-red-500">{errors.type.message}</Text>
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

          <View className="mt-2 flex-row items-center gap-4">
            <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
              <Text className="text-base font-medium">SIC</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="crew.sic"
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
            />

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
