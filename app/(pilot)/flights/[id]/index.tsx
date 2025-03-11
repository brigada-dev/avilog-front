import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack, Link, router } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';
import { useFlightContext } from '~/context/flight-context';
import { api } from '~/api/api';
import { useAuth } from '~/context/auth-context';
import { format, parseISO } from 'date-fns';
import { differenceInMinutes } from 'date-fns';
import { Flight, parseCrew } from '~/api/flights';

const calculateDuration = (departure: string, arrival: string): string => {
  const depTime = parseISO(departure);
  const arrTime = parseISO(arrival);

  const diffMinutes = differenceInMinutes(arrTime, depTime);

  if (diffMinutes < 0) return '00:00';

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export default function FlightDetails() {
  const { id } = useLocalSearchParams();
  const { selectedFlight } = useFlightContext();
  const { token } = useAuth();
  const [flight, setFlight] = useState<Flight | null>(selectedFlight);
  const [isLoading, setIsLoading] = useState(!selectedFlight);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Helper function to process flight data
  const processFlightData = (flightData: Flight): Flight => {
    const processedData = {...flightData};
    
    // Process crew data if it's a string
    if (processedData.crew && typeof processedData.crew === 'string') {
      try {
        processedData.crew = JSON.parse(processedData.crew);
      } catch (e) {
        console.error('Error parsing crew data:', e);
        processedData.crew = [];
      }
    }
    
    // Process summary data if it's a string
    if (processedData.summary && typeof processedData.summary === 'string') {
      try {
        processedData.summary = JSON.parse(processedData.summary);
      } catch (e) {
        console.error('Error parsing summary data:', e);
        processedData.summary = {};
      }
    }
    
    return processedData;
  };

  useEffect(() => {
    if (!selectedFlight && id) {
      setIsLoading(true);
      api(`/flights/${id.toString()}`, token!)
        .then((response) => {
          // Process the response data to ensure crew and summary are in the correct format
          setFlight(processFlightData(response.data));
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching flight:', err);
          setError('Failed to load flight details');
          setIsLoading(false);
        });
    } else if (selectedFlight) {
      // Update the local flight state with the processed selected flight
      setFlight(processFlightData(selectedFlight));
    }
  }, [id, selectedFlight, token]);

  // Add a useEffect to refresh the data when the component mounts
  useEffect(() => {
    if (id) {
      api(`/flights/${id.toString()}`, token!)
        .then((response) => {
          // Process the response data to ensure crew and summary are in the correct format
          setFlight(processFlightData(response.data));
        })
        .catch((err) => {
          console.error('Error refreshing flight data:', err);
        });
    }
  }, [id, token]);

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

  if (error || !flight) {
    return (
      <Layout variant="secondary">
        <Header title="Flight Not Found" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-500">{error || 'Flight not found'}</Text>
          <TouchableOpacity 
            className="mt-4 rounded-lg bg-[#2B9C1A] px-4 py-2"
            onPress={() => router.back()}
          >
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  const flightDate = format(parseISO(flight.departure_date_time), 'dd/MM/yy');
  const depTime = format(parseISO(flight.departure_date_time), 'HH:mm');
  const arrTime = format(parseISO(flight.arrival_date_time), 'HH:mm');
  const duration = calculateDuration(flight.departure_date_time, flight.arrival_date_time);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <Header title={`${flight.departure_airport.code} - ${flight.arrival_airport.code}`} />
        <View className="mb-4 rounded-xl shadow-default">
          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={{ height: 42, width: 42 }}
              />
              <Text className="text-lg font-medium">{flightDate}</Text>
              <View className="h-full w-px bg-black/10" />
              <Text className="text-lg font-medium">{flightDate}</Text>
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={{ height: 42, width: 42 }}
              />
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/pin.png')}
                style={{ height: 32, width: 32 }}
              />
              <Text className="text-lg font-medium">{flight.departure_airport.code}</Text>
              <Image
                source={{ uri: `https://flagcdn.com/w40/${flight.departure_country_iso.toLowerCase()}.png` }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <Image source={require('../../../../assets/images/paper-plane.png')} />
              <Image
                source={{ uri: `https://flagcdn.com/w40/${flight.arrival_country_iso.toLowerCase()}.png` }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <Text className="text-lg font-medium">{flight.arrival_airport.code}</Text>
              <Image
                source={require('../../../../assets/images/pin.png')}
                style={{ height: 36, width: 36 }}
              />
            </View>

            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-2 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/klok.png')}
                style={{ height: 36, width: 36 }}
              />
              <Text className="mt-2 text-center text-lg">{depTime}</Text>
              <Text className="mt-2 font-semibold text-[#72AA6D]">UTC</Text>
              <Text className="mt-2 text-center text-xl font-semibold">{duration}</Text>
              <Text className="mt-2 font-semibold text-[#72AA6D]">UTC</Text>
              <Text className="mt-2 text-center text-lg">{arrTime}</Text>
              <Image
                source={require('../../../../assets/images/klok.png')}
                style={{ height: 36, width: 36 }}
              />
            </View>

            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-2">
              <Text>Landings</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('../../../../assets/images/landing.png')}
                    style={{ width: 36, height: 36 }}
                  />
                  <Text className="text-xl">{flight.day_landings}</Text>
                </View>
                <Text className="text-xl">Day</Text>
                <View className="flex-row justify-between">
                  <Text className="text-base">Approach Type:</Text>
                  <Text className="ml-2 text-base font-medium">{flight.approach_type || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-1 flex-row overflow-hidden rounded-xl border border-[#DBDADA] bg-white">
            <View className="flex-1">
              {flight.aircraft.imageUrl ? (
                <Image source={{ uri: flight.aircraft.imageUrl }} style={{ height: 128 }} />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                    <Image
                      source={require('../../../../assets/images/image_placeholder.png')}
                      style={{ height: 80, width: 80 }}
                    />
                  </View>
                </View>
              )}
            </View>
            <View className="flex-1">
              <View className="p-4">
                <Text className="text-lg font-bold">{flight.aircraft.registration}</Text>
                <Text className="text-sm">{flight.aircraft.type}</Text>
              </View>
              <View className="ml-4 flex flex-row gap-2">
                <View className="flex-row items-center">
                  <Image
                    source={require('../../../../assets/images/clock.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-sm font-bold">{flight.aircraft.flightTime}</Text>
                </View>
                <View className="flex-row items-center">
                  <Image
                    source={require('../../../../assets/images/landing.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-sm font-bold">{flight.aircraft.flights}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="mt-2">
              <Text>Crew</Text>
            </View>
            {(() => {
              const crewMembers = parseCrew(flight.crew);
              return crewMembers.length > 0 ? (
                crewMembers.map((member, index) => (
                  <View key={index} className="mt-2 flex-row items-center gap-4">
                    <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
                      <Text className="text-base font-medium">{member.type}</Text>
                    </TouchableOpacity>
                    <Text className="text-base">{member.name}</Text>
                  </View>
                ))
              ) : (
                <View className="mt-2 items-center justify-center py-4">
                  <Text className="text-gray-500">No crew members assigned</Text>
                </View>
              );
            })()}
          </View>

          <View className="mt-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-semibold">Summary</Text>
            <View className="mt-2 flex-row flex-wrap gap-4">
              {Object.entries(flight.summary).map(([key, value]) => (
                <View
                  key={key}
                  className="aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                  <Text className="text-base font-bold">{typeof value === 'number' ? value.toFixed(1) : value}</Text>
                  <Text className="text-xs text-gray-500">{key.toUpperCase()}</Text>
                </View>
              ))}
            </View>
            <View className="mt-3 h-px w-full bg-black/10" />
            <Button
              title="Adjust"
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

          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="mt-2 flex-row flex-wrap gap-4">
              <TextInput 
                className="flex-1 py-2 font-bold text-gray-800"
                value={flight.signature || ''}
                editable={false}
                placeholder="No signature"
                placeholderTextColor="#999"
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

          <View className="mt-4 flex-row justify-between">
            <Link href={`/flights/${id}/edit`} asChild>
              <TouchableOpacity className="mr-2 flex-1 rounded-lg bg-[#2B9C1A] py-3">
                <Text className="text-center font-semibold text-white">Edit</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity 
              className="ml-2 flex-1 rounded-lg bg-red-500 py-3"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-center font-semibold text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Layout>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="m-5 w-4/5 rounded-lg bg-white p-6 shadow-default">
            <Text className="mb-4 text-lg font-bold">Confirm Deletion</Text>
            <Text className="mb-4">Are you sure you want to delete this flight?</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="rounded-lg bg-gray-300 px-4 py-2"
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="rounded-lg bg-red-500 px-4 py-2"
                onPress={() => {
                  // Handle delete logic here
                  setModalVisible(false);
                  router.replace('/flights');
                }}
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4DD740',
    padding: 32,
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#E6FAF1',
  },
  flag: {
    width: 20,
    height: 15,
    marginLeft: 4,
  },
  aircraftImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: '#C8B100',
    padding: 32,
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#AD1519',
    padding: 32,
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
