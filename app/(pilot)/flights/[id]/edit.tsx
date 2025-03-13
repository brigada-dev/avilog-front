import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInMinutes, format, formatISO, parse, parseISO } from 'date-fns';
import { Button } from '~/components/Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFlight, updateFlight, FlightFormData, flightSchema } from '~/api/flights';
import { useAuth } from '~/context/auth-context';
import { AirportSelectionSheet } from '~/components/airport/airport-selection-sheet';
import { CrewRole, fetchCrewRoles } from '~/api/crews';
import { CrewForm } from '~/components/crew/crew-form';
import { CrewSelectionSheet } from '~/components/crew/crew-selection-sheet';
import { FlightSummary, SummaryModal } from '~/components/summary-modal';
import { AircraftSelectionSheet } from '~/components/aircraft/AircraftSelectionSheet';
import { useFlightContext } from '~/context/flight-context';

export default function EditFlight() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { selectedFlight, setSelectedFlight } = useFlightContext();
  const [isLoading, setIsLoading] = useState(!selectedFlight);
  const [error, setError] = useState<string | null>(null);
  const [departureAirport, setDepartureAirport] = useState<string | null>();
  const [arrivalAirport, setArrivalAirport] = useState<string | null>();
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);

  // Fetch flight data if not already in context
  useEffect(() => {
    if (!selectedFlight && id && token) {
      setIsLoading(true);
      fetchFlight(id.toString(), token)
        .then((flight) => {
          setSelectedFlight(flight);
          setDepartureAirport(flight.departure_country_iso);
          setArrivalAirport(flight.arrival_country_iso);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching flight:', err);
          setError('Failed to load flight details');
          setIsLoading(false);
        });
    } else if (selectedFlight) {
      setDepartureAirport(selectedFlight.departure_country_iso);
      setArrivalAirport(selectedFlight.arrival_country_iso);
    }
  }, [id, selectedFlight, token]);

  const {
    data: crewRoles,
    isLoading: isCrewLoading,
    error: crewError,
  } = useQuery({
    queryKey: ['crews'],
    queryFn: () => fetchCrewRoles(token!),
  });

  // Initialize form with flight data when available
  const form = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      aircraft_id: selectedFlight?.aircraft_id,
      departure_airport_id: selectedFlight?.departure_airport_id,
      arrival_airport_id: selectedFlight?.arrival_airport_id,
      departure_date_time: selectedFlight?.departure_date_time || new Date().toISOString(),
      arrival_date_time: selectedFlight?.arrival_date_time || new Date().toISOString(),
      departure: {
        day: selectedFlight?.day_landings || 0,
        night: selectedFlight?.night_landings || 0,
      },
      type_of_flight: selectedFlight?.type_of_flight || '',
      approach_type: selectedFlight?.approach_type || '',
      landing: {
        day: selectedFlight?.day_landings || 0,
        night: selectedFlight?.night_landings || 0,
      },
      crew:
        selectedFlight?.crew && typeof selectedFlight.crew === 'string'
          ? JSON.parse(selectedFlight.crew)
          : selectedFlight?.crew || [],
      summary:
        selectedFlight?.summary && typeof selectedFlight.summary === 'string'
          ? JSON.parse(selectedFlight.summary)
          : selectedFlight?.summary || {},
      signature: selectedFlight?.signature || '',
    },
  });

  // Update form values when flight data changes
  useEffect(() => {
    if (selectedFlight) {
      form.reset({
        aircraft_id: selectedFlight.aircraft_id,
        departure_airport_id: selectedFlight.departure_airport_id,
        arrival_airport_id: selectedFlight.arrival_airport_id,
        departure_date_time: selectedFlight.departure_date_time,
        arrival_date_time: selectedFlight.arrival_date_time,
        departure: {
          day: selectedFlight.day_landings || 0,
          night: selectedFlight.night_landings || 0,
        },
        type_of_flight: selectedFlight.type_of_flight || '',
        approach_type: selectedFlight.approach_type || '',
        landing: {
          day: selectedFlight.day_landings || 0,
          night: selectedFlight.night_landings || 0,
        },
        crew:
          selectedFlight.crew && typeof selectedFlight.crew === 'string'
            ? JSON.parse(selectedFlight.crew)
            : selectedFlight.crew || [],
        summary:
          selectedFlight.summary && typeof selectedFlight.summary === 'string'
            ? JSON.parse(selectedFlight.summary)
            : selectedFlight.summary || {},
        signature: selectedFlight.signature || '',
      });
    }
  }, [selectedFlight, form]);

  const { width, height } = Dimensions.get('screen');

  const depTime = form.watch('departure_date_time');
  const arrTime = form.watch('arrival_date_time');
  const crewState = form.watch('crew') || [];
  const departureDayValue = form.watch('departure.day');
  const departureNightValue = form.watch('departure.night');
  const landingDayValue = form.watch('landing.day');
  const landingNightValue = form.watch('landing.night');

  const minutesToHours = (minutes: number) => {
    if (minutes < 0) return '0:00';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSaveAdjustments = (updatedSummary: FlightSummary) => {
    const filteredSummary = Object.fromEntries(
      Object.entries(updatedSummary)
        .map(([key, value]) => [
          key,
          typeof value === 'number' ? parseFloat(value.toFixed(1)) : value,
        ])
        .filter(([_, value]) => value !== 0.0)
    );

    form.setValue('summary', filteredSummary);
    setSummaryModalVisible(false);
  };

  const mutation = useMutation({
    mutationFn: (data: FlightFormData) => updateFlight(Number(id), data, token!),
    onSuccess: async (response, variables) => {
      try {
        // Store the submitted data for comparison
        const submittedData = variables;
        console.log('Submitted data:', submittedData);
        console.log('Response from API:', response);
        
        // Get the flight data from the response
        const flightData = response.data;
        
        // Create the processed flight data
        const processedFlight = {
          ...flightData,
          crew: flightData.crew,  // Already processed in updateFlight
          summary: flightData.summary,  // Already processed in updateFlight
          departure: flightData.departure,  // Already processed in updateFlight
          landing: flightData.landing,  // Already processed in updateFlight
          day_landings: typeof flightData.departure === 'object' ? 
            (flightData.departure.day || 0) + (flightData.landing?.day || 0) : 0,
          night_landings: typeof flightData.departure === 'object' ? 
            (flightData.departure.night || 0) + (flightData.landing?.night || 0) : 0,
        };
        
        console.log('Processed flight data:', processedFlight);
        
        // Update the flight in the context
        setSelectedFlight(processedFlight);
        
        // Invalidate queries to ensure data consistency
        queryClient.invalidateQueries({ queryKey: ['flights'] });
        queryClient.invalidateQueries({ queryKey: ['recent-flights'] });
        queryClient.invalidateQueries({ queryKey: ['aircraft'] });
        
        // Force a refetch of this specific flight
        await queryClient.refetchQueries({ queryKey: ['flights', id] });
        
        // Show success message
        Alert.alert('Success', 'Flight updated successfully');
        
        // Navigate back
        router.back();
      } catch (error) {
        console.error('Error in onSuccess handler:', error);
        Alert.alert('Error', 'An unexpected error occurred while processing the response.');
      }
    },
    onError: (error) => {
      console.error('Error updating flight:', error);
      Alert.alert('Error', 'Failed to update flight');
    },
  });

  const handleSaveFlight = async (data: FlightFormData) => {
    try {
      // Log the current form values for debugging
      console.log('Form values before submission:', data);
      
      // Create a deep copy of the data to avoid reference issues
      const formData = { ...data };
      
      // Ensure crew is an array
      if (!Array.isArray(formData.crew)) {
        formData.crew = [];
      }
      
      // Filter summary to remove entries with zero values and convert string values to numbers
      if (formData.summary) {
        const filteredSummary: Record<string, number> = {};
        Object.entries(formData.summary).forEach(([key, value]) => {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          if (numValue && numValue > 0) {
            filteredSummary[key] = numValue;
          }
        });
        formData.summary = filteredSummary;
      } else {
        formData.summary = {};
      }
      
      // Ensure departure and landing values are set
      formData.departure = {
        day: typeof formData.departure?.day === 'number' ? formData.departure.day : 0,
        night: typeof formData.departure?.night === 'number' ? formData.departure.night : 0,
      };
      
      formData.landing = {
        day: typeof formData.landing?.day === 'number' ? formData.landing.day : 0,
        night: typeof formData.landing?.night === 'number' ? formData.landing.night : 0,
      };
      
      // Ensure signature is a string
      formData.signature = formData.signature || '';
      
      // Ensure country ISO codes are set
      formData.departure_country_iso = departureAirport || '';
      formData.arrival_country_iso = arrivalAirport || '';
      
      // Log the formatted data before submission
      console.log('Formatted data for submission:', formData);
      
      // Submit the data
      mutation.mutate(formData);
    } catch (error) {
      console.error('Error in handleSaveFlight:', error);
      Alert.alert('Error', 'An error occurred while preparing the flight data for submission.');
    }
  };

  if (isLoading) {
    return (
      <Layout variant="secondary">
        <Header title="Loading..." />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B9C1A" />
        </View>
      </Layout>
    );
  }

  if (error || !selectedFlight) {
    return (
      <Layout variant="secondary">
        <Header title="Flight Not Found" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-500">{error || 'Flight not found'}</Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-[#2B9C1A] px-4 py-2"
            onPress={() => router.back()}>
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title="Edit Flight" />
        <ScrollView>
          <View className="mb-4 rounded-xl bg-white p-4 shadow-default">
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="mt-2 flex-row items-center gap-2">
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
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
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
            </View>
            <View className="mt-4 flex-row items-center justify-between gap-1">
              <View className="flex-1">
                <Controller
                  control={form.control}
                  name="departure_airport_id"
                  render={({ field: { onChange, value } }) =>
                    isCrewLoading ? (
                      <ActivityIndicator style={{ backgroundColor: 'green' }} />
                    ) : (
                      <AirportSelectionSheet
                        value={value}
                        onChange={onChange}
                        setDepartureAirport={setDepartureAirport}
                        errors={form.formState.errors.departure_airport_id || null}
                      />
                    )
                  }
                />
              </View>
              {departureAirport && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${departureAirport.toLowerCase()}.png`,
                  }}
                  style={{ width: 32, height: 24, borderRadius: 6 }}
                />
              )}
              <Image
                source={require('../../../../assets/images/paper-plane.png')}
                style={{ height: 32, width: 32 }}
              />
              {arrivalAirport && (
              <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${arrivalAirport.toLowerCase()}.png`,
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
                      errors={form.formState.errors.arrival_airport_id || null}
                    />
                  )}
                />
              </View>
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
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
                {minutesToHours(differenceInMinutes(new Date(arrTime), new Date(depTime)))}
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
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
            </View>
          </View>

          <View className="mb-4 rounded-xl bg-white p-4 shadow-default">
            <View className="mb-4 rounded-xl">
              <Text className="text-base font-normal">Aircraft</Text>
              <Controller
                control={form.control}
                name="aircraft_id"
                render={({ field: { value, onChange } }) => (
                  <AircraftSelectionSheet
                    value={value}
                    onChange={onChange}
                    errors={form.formState.errors.aircraft_id || null}
                  />
                )}
              />
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
                      onPress={() =>
                        form.setValue('departure.day', Math.max(0, departureDayValue - 1))
                      }>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                    <Controller
                      control={form.control}
                      name="departure.day"
                      render={({ field }) => (
                        <Text className="shrink-0 text-xl font-bold">{field.value}</Text>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => form.setValue('departure.day', departureDayValue + 1)}>
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
                      onPress={() =>
                        form.setValue('departure.night', Math.max(0, departureNightValue - 1))
                      }>
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
                      onPress={() => form.setValue('departure.night', departureNightValue + 1)}>
                    <Feather name="plus-circle" size={42} color="#23d013" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="mt-2 rounded-xl border border-black/10">
                <View className="mt-2">
                <View className="border-b border-black/10 p-2">
                  <Text>Type of flight</Text>

                    <Ionicons
                      name="list"
                      size={32}
                      color="#23D013"
                      className="absolute right-3 top-3"
                    />
                  <View className="justify-center">
                      <Controller
                        control={form.control}
                        name="type_of_flight"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            onChangeText={onChange}
                            value={value ?? ''}
                            className="text-center text-xl"
                          />
                        )}
                      />
                    </View>
                  </View>
                </View>
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
                      <Controller
                        control={form.control}
                        name="approach_type"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            onChangeText={onChange}
                            value={value ?? ''}
                            className="text-center text-xl"
                          />
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View className="mt-2 flex-row items-center justify-around pb-2">
                  {/* Day Counter */}
                  <View className="flex-col items-center">
                    <Text className="text-lg font-bold">Day</Text>
                    <View
                      className="flex-row items-center justify-between gap-2"
                      style={{ width: width * 0.5 - 80 }}>
                      <TouchableOpacity
                        onPress={() =>
                          form.setValue('landing.day', Math.max(0, landingDayValue - 1))
                        }>
                        <Feather name="minus-circle" size={42} color="#23d013" />
                      </TouchableOpacity>
                      <Controller
                        control={form.control}
                        name="landing.day"
                        render={({ field }) => (
                          <Text className="shrink-0 text-xl font-bold">{field.value}</Text>
                        )}
                      />
                      <TouchableOpacity
                        onPress={() => form.setValue('landing.day', landingDayValue + 1)}>
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
                        onPress={() =>
                          form.setValue('landing.night', Math.max(0, landingNightValue - 1))
                        }>
                        <Feather name="minus-circle" size={42} color="#23d013" />
                      </TouchableOpacity>
                      <Controller
                        control={form.control}
                        name="landing.night"
                        render={({ field }) => (
                          <Text className="text-xl font-bold">{field.value}</Text>
                        )}
                      />
                      <TouchableOpacity
                        onPress={() => form.setValue('landing.night', landingNightValue + 1)}>
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      </TouchableOpacity>
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

          <View className="mt-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-semibold">Summary</Text>

            <View className="flex-row justify-between">
              <FlatList
                data={Object.entries(form.watch('summary') || {}).filter(
                  ([_, value]) => value !== 0.0
                )}
                horizontal
                keyExtractor={([key]) => key}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const [key, value] = item;
                  return (
                <View
                  key={key}
                      className="mx-2 aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                      <Text className="text-base font-bold">{value.toFixed(1)}</Text>
                  <Text className="text-xs text-gray-500">{key.toUpperCase()}</Text>
                </View>
                  );
                }}
              />
            </View>

            <View className="mt-3 h-px w-full bg-black/10" />

            <Button
              title="Adjust"
              iconLeft={require('../../../../assets/images/edit.png')}
              onPress={() => setSummaryModalVisible(true)}
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
            <Text className="mb-2 text-base font-normal">Signature</Text>
            <View className="mt-2 flex-row flex-wrap gap-4">
              <Controller
                control={form.control}
                name="signature"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 rounded-md border border-gray-300 px-2 py-2 font-bold text-gray-800"
                    value={value || ''}
                    onChangeText={onChange}
                    placeholder="Enter your signature"
                  />
                )}
              />
            </View>
            <View className="mt-3 h-px w-full bg-black/10" />
            <Button
              title="Signature"
              iconLeft={require('../../../../assets/images/edit.png')}
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
              <Text style={styles.saveButtonText}>Save Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
      <SummaryModal
        visible={summaryModalVisible}
        onClose={() => setSummaryModalVisible(false)}
        flightSummary={form.watch('summary') || {}}
        onSave={handleSaveAdjustments}
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
