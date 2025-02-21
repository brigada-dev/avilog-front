import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { GradientBackgroundSecondary } from '~/components/ui/GradientBackground';
import { ScrollView } from 'react-native';
import { Container } from '~/components/Container';
import { Ionicons } from '@expo/vector-icons';

const aircrafts = [
  {
    id: 1,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    engineType: 'Turboprop',
    multiEngine: true,
    multiPilot: true,
    totalTime: '270:30',
    dayTime: '220:10',
    nightTime: '50:20',
    departures: 88,
    landings: 88,
    dayDepartures: 70,
    nightDepartures: 18,
    dayLandings: 70,
    nightLandings: 18,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 2,
    name: 'OY-FSC',
    type: 'SAAB 2000',
    engineType: 'Turboprop',
    multiEngine: true,
    multiPilot: true,
    totalTime: '110:40',
    dayTime: '90:30',
    nightTime: '20:10',
    departures: 75,
    landings: 75,
    dayDepartures: 60,
    nightDepartures: 15,
    dayLandings: 60,
    nightLandings: 15,
    imageUrl: null,
  },
  {
    id: 3,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    engineType: 'Turboprop',
    multiEngine: true,
    multiPilot: true,
    totalTime: '108:25',
    dayTime: '88:10',
    nightTime: '20:15',
    departures: 88,
    landings: 88,
    dayDepartures: 70,
    nightDepartures: 18,
    dayLandings: 70,
    nightLandings: 18,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 4,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    engineType: 'Turboprop',
    multiEngine: true,
    multiPilot: true,
    totalTime: '52:10',
    dayTime: '42:00',
    nightTime: '10:10',
    departures: 32,
    landings: 32,
    dayDepartures: 25,
    nightDepartures: 7,
    dayLandings: 25,
    nightLandings: 7,
    imageUrl: null,
  },
];

export default function AircraftDetails() {
  const { id } = useLocalSearchParams();
  const aircraft = aircrafts.find((a) => a.id.toString() === id);

  if (!aircraft) {
    return (
      <Layout>
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
      <GradientBackgroundSecondary>
        <ScrollView>
          <Container>
            <View className="mb-4 rounded-xl bg-[#F5F5F5] p-4">
              <Header title="Aircraft" />
              <View className="overflow-hidden rounded-xl">
                {aircraft.imageUrl ? (
                  <Image
                    source={{ uri: aircraft.imageUrl }}
                    style={{ height: 200, width: '100%' }}
                  />
                ) : (
                  <View className="flex h-48 items-center justify-center bg-gray-300">
                    <Image
                      source={require('../../../assets/images/image_placeholder.png')}
                      style={{ height: 80, width: 80 }}
                    />
                  </View>
                )}
              </View>

              {/* Aircraft Information */}
              <View className="mt-4 rounded-xl border border-[#DBDADA] bg-white p-4">
                <Text className="text-center text-xl font-bold">{aircraft.name}</Text>
                <View className="mt-2 flex-row justify-between">
                  <View className="flex-1 flex-col">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require('../../../assets/images/front_plane.png')}
                        style={{ height: 24, width: 24 }}
                      />
                      <Text className="text-md">{aircraft.type}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require('../../../assets/images/engine.png')}
                        style={{ height: 24, width: 24 }}
                      />
                      <Text className="text-md">{aircraft.engineType}</Text>
                    </View>
                  </View>
                  <View className="h-full w-px bg-[#DBDADA]" />
                  <View className="flex-1 flex-col pl-4">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require('../../../assets/images/jet_engine.png')}
                        style={{ height: 24, width: 24 }}
                      />
                      <Text className="text-md">
                        {aircraft.multiEngine ? 'Multi Engine' : 'Single Engine'}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require('../../../assets/images/pilot_hat.png')}
                        style={{ height: 24, width: 24 }}
                      />
                      <Text className="text-md">
                        {aircraft.multiPilot ? 'Multi Pilot' : 'Single Pilot'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="my-6 h-px bg-[#DBDADA]" />

              <View className="rounded-xl border border-[#DBDADA] bg-white p-4">
                <View>
                  <View className="flex-row items-center justify-center gap-1">
                    <Image
                      source={require('../../../assets/images/clock.png')}
                      style={{ height: 24, width: 24 }}
                    />
                    <Text className="text-center text-lg font-bold">Total time</Text>
                  </View>
                  <Text className="text-center text-sm">{aircraft.totalTime} h</Text>
                </View>
                <View className="mt-2 flex-row justify-between">
                  <View className="relative rounded-xl border border-[#DBDADA] px-10 py-3">
                    <Image
                      source={require('../../../assets/images/sun.png')}
                      style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                    />
                    <View>
                      <Text className="text-center text-lg font-semibold">Day</Text>
                      <Text className="text-c enter text-base">{aircraft.dayTime} h</Text>
                    </View>
                  </View>
                  <View className="rounded-xl border border-[#DBDADA] px-10 py-3">
                    <Image
                      source={require('../../../assets/images/fog.png')}
                      style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                    />
                    <View>
                      <Text className="text-center text-lg font-semibold">Night</Text>
                      <Text className="text-center text-base">{aircraft.nightTime} h</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="my-6 h-px bg-[#DBDADA]" />

              <View className="flex-row items-center justify-between">
                <View className="rounded-xl border border-[#DBDADA] bg-white p-4">
                  <View className="flex-col items-center justify-center gap-2">
                    <Text className="text-lg font-bold">Departures</Text>
                    <Text className="text-lg font-bold">{aircraft.departures}</Text>
                    <View className="rounded-xl border border-[#DBDADA] px-12 py-3">
                      <Image
                        source={require('../../../assets/images/fog.png')}
                        style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                      />
                      <View>
                        <Text className="text-center text-lg font-semibold">Day</Text>
                        <Text className="text-center text-base">{aircraft.dayDepartures}</Text>
                      </View>
                    </View>
                    <View className="rounded-xl border border-[#DBDADA] px-10 py-3">
                      <Image
                        source={require('../../../assets/images/fog.png')}
                        style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                      />
                      <View>
                        <Text className="text-center text-lg font-semibold">Night</Text>
                        <Text className="text-center text-base">{aircraft.nightDepartures}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="my-6 h-px bg-[#DBDADA]" />

                <View className="rounded-xl border border-[#DBDADA] bg-white p-4">
                  <View className="flex-1 flex-col items-center justify-center gap-2">
                    <Text className="text-lg font-bold">Landings</Text>
                    <Text className="text-lg font-bold">{aircraft.dayLandings}</Text>
                    <View className="rounded-xl border border-[#DBDADA] px-12 py-3">
                      <Image
                        source={require('../../../assets/images/fog.png')}
                        style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                      />
                      <View>
                        <Text className="text-center text-lg font-semibold">Day</Text>
                        <Text className="text-center text-base">{aircraft.dayLandings}</Text>
                      </View>
                    </View>
                    <View className="rounded-xl border border-[#DBDADA] px-10 py-3">
                      <Image
                        source={require('../../../assets/images/fog.png')}
                        style={{ height: 24, width: 24, position: 'absolute', top: 16, left: 16 }}
                      />
                      <View>
                        <Text className="text-center text-lg font-semibold">Night</Text>
                        <Text className="text-center text-base">{aircraft.nightLandings}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className="my-6 h-px bg-[#DBDADA]" />

              <View className="flex-row justify-between">
                <Link href={`/(pilot)/time`} asChild>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Show flights</Text>
                  </TouchableOpacity>
                </Link>
                <Link href={`../edit/${id}`} asChild>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.buttonText}>Edit aircraft</Text>
                  </TouchableOpacity>
                </Link>
              </View>

              <View className="mt-4 pb-2">
                <TouchableOpacity
                  style={[styles.deleteBtn]}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.buttonText}>Delete aircraft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Container>
        </ScrollView>
      </GradientBackgroundSecondary>
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
