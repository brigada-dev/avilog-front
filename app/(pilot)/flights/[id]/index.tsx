import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { AircraftCard } from '~/components/flight/AircraftCard';
import { Button } from '~/components/Button';

const flights = [
  {
    id: 1,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: 'https://flagcdn.com/w40/lv.png',
    arrFlag: 'https://flagcdn.com/w40/se.png',
    landings: 1,
    approachType: 'ILS CAT 1',
    timezone: 'UTC',
    aircraft: {
      type: 'SAAB 2000',
      imageUrl: null,
      flightTime: '275:30',
      flights: 125,
    },
    crew: {
      sic: 'Self',
      pic: 'John Doe',
    },
    summary: {
      total: '1:35',
      sic: '1:35',
      mp: '1:35',
      ifr: '1:35',
      xc: '1:35',
    },
  },
  {
    id: 2,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: 'https://flagcdn.com/w40/ro.png',
    arrFlag: 'https://flagcdn.com/w40/lv.png',
    landings: 1,
    approachType: 'ILS CAT 2',
    timezone: 'UTC',
    aircraft: {
      type: 'Boeing 737',
      imageUrl: null,

      flightTime: '500:20',
      flights: 220,
    },
    crew: {
      sic: 'Self',
      pic: 'Jane Smith',
    },
    summary: {
      total: '1:35',
      sic: '1:35',
      mp: '1:35',
      ifr: '1:35',
      xc: '1:35',
    },
  },
  {
    id: 3,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: 'https://flagcdn.com/w40/lv.png',
    arrFlag: 'https://flagcdn.com/w40/ro.png',
    landings: 1,
    approachType: 'RNAV',
    timezone: 'UTC',
    aircraft: {
      type: 'Airbus A320',
      imageUrl: null,
      flightTime: '600:50',
      flights: 300,
    },
    crew: {
      sic: 'Self',
      pic: 'Mike Johnson',
    },
    summary: {
      total: '1:35',
      sic: '1:35',
      mp: '1:35',
      ifr: '1:35',
      xc: '1:35',
    },
  },
  {
    id: 4,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: 'https://flagcdn.com/w40/se.png',
    arrFlag: 'https://flagcdn.com/w40/lv.png',
    landings: 1,
    approachType: 'Visual',
    timezone: 'UTC',
    aircraft: {
      type: 'Cessna 172',
      imageUrl: null,
      flightTime: '150:10',
      flights: 50,
    },
    crew: {
      sic: 'Self',
      pic: 'Sarah Wilson',
    },
    summary: {
      total: '1:35',
      sic: '1:35',
      mp: '1:35',
      ifr: '1:35',
      xc: '1:35',
    },
  },
];

export default function FlightDetails() {
  const { id } = useLocalSearchParams();
  const flight = flights.find((flight) => flight.id.toString() === id);
  if (!flight) {
    return (
      <Layout variant="secondary">
        <Header title="Aircraft Not Found" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Aircraft not found</Text>
        </View>
      </Layout>
    );
  }
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title={`${flight.from} - ${flight.to}`} />
        <View className="mb-4 rounded-xl shadow-sm">
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
              <Text className="text-lg font-medium">{flight.date}</Text>
              <View className="h-full w-px bg-black/10" />
              <Text className="text-lg font-medium">{flight.date}</Text>
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
              <Text className="text-lg font-medium">{flight.from}</Text>
              <Image
                source={{ uri: flight.depFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <Image source={require('../../../../assets/images/paper-plane.png')} />
              <Image
                source={{ uri: flight.arrFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <Text className="text-lg font-medium">{flight.to}</Text>
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
              <Text className="mt-2 text-center text-lg">{flight.depTime}</Text>
              <Text className="mt-2 font-semibold text-[#72AA6D]">{flight.timezone}</Text>
              <Text className="mt-2 text-center text-xl font-semibold">{flight.duration}</Text>
              <Text className="mt-2 font-semibold text-[#72AA6D]">{flight.timezone}</Text>
              <Text className="mt-2 text-center text-lg">{flight.arrTime}</Text>
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
                  <Text className="text-xl">{flight.landings}</Text>
                </View>
                <Text className="text-xl">Day</Text>
                <View className="flex-row justify-between">
                  <Text className="text-xl">{flight.approachType}</Text>
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
                <Text className="text-lg font-bold">{flight.registration}</Text>
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
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
                <Text className="text-base font-medium">SIC</Text>
              </TouchableOpacity>
              <Text className="text-base">{flight.crew.sic}</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
                <Text className="text-base font-medium">PIC</Text>
              </TouchableOpacity>
              <Text className="text-base">{flight.crew.pic}</Text>
            </View>
          </View>

          <View className="mt-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-semibold">Summary</Text>
            <View className="mt-2 flex-row flex-wrap gap-4">
              {Object.entries(flight.summary).map(([key, value]) => (
                <View
                  key={key}
                  className="aspect-square size-16 items-center justify-center rounded-full border-4 border-[#81E371]">
                  <Text className="text-base font-bold">{value}</Text>
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
              <TextInput className="flex-1 py-2 font-bold text-gray-800" />
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
            <Link href={`/(pilot)/flights/${id}/edit`} asChild>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.buttonText}>Edit flight</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText}>Delete flight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Layout>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={32} color="black" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Text style={styles.modalText}>
                By deleting the aircraft, all flights will also be deleted.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: '#AD1519', paddingVertical: 16, borderRadius: 16 },
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text style={styles.modalButtonText}>Delete aircraft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
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
