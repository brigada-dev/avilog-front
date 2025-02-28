import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Image } from 'expo-image';
import { Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAircraft } from '~/api/aircrafts';
import { useAuth } from '~/context/auth-context';
import { useAircraftContext } from '~/context/aircraft-context';

export default function AircraftDetails() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { selectedAircraft: aircraft } = useAircraftContext();
  if (!aircraft) {
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

  const deleteMutation = useMutation({
    mutationFn: () => deleteAircraft(Number(aircraft!.id), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      setModalVisible(false);
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <View className="mb-4 rounded-xl bg-[#F5F5F5] p-4">
          <Header title="Aircraft" />
          <View className="overflow-hidden rounded-xl">
            {aircraft.image_url ? (
              <Image source={{ uri: aircraft.image_url }} style={{ height: 200, width: '100%' }} />
            ) : (
              <View className="flex h-48 items-center justify-center bg-gray-300">
                <Image
                  source={require('../../../../assets/images/image_placeholder.png')}
                  style={{ height: 80, width: 80 }}
                />
              </View>
            )}
          </View>
          <View className="mt-4 rounded-xl border border-[#DBDADA] bg-white p-4">
            <Text className="text-center text-xl font-bold">{aircraft.registration}</Text>
            <View className="mt-2 flex-row justify-between">
              <View className="flex-1 flex-col">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('../../../../assets/images/front_plane.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-md">{aircraft.type}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('../../../../assets/images/engine.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-md">{aircraft.engine_type}</Text>
                </View>
              </View>
              <View className="h-full w-px bg-[#DBDADA]" />
              <View className="flex-1 flex-col pl-4">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('../../../../assets/images/jet_engine.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-md">
                    {aircraft.is_multi_engine ? 'Multi Engine' : 'Single Engine'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('../../../../assets/images/pilot_hat.png')}
                    style={{ height: 24, width: 24 }}
                  />
                  <Text className="text-md">
                    {aircraft.is_multi_pilot ? 'Multi Pilot' : 'Single Pilot'}
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
                  source={require('../../../../assets/images/clock.png')}
                  style={{ height: 24, width: 24 }}
                />
                <Text className="text-center text-lg font-bold">Total time</Text>
              </View>
              <Text className="text-center text-sm">40 h</Text>
            </View>
          </View>

          <View className="my-6 h-px bg-[#DBDADA]" />

          <View className="flex-row justify-between">
            <Link href={`/(pilot)/time`} asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Show flights</Text>
              </TouchableOpacity>
            </Link>
            <Link href={`/(pilot)/aircrafts/${aircraft.id}/edit`} asChild replace>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.buttonText}>Edit aircraft</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mt-4 pb-2">
            <TouchableOpacity style={[styles.deleteBtn]} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Delete aircraft</Text>
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
                  style={[styles.modalButton, { backgroundColor: '#AD1519' }]}
                  onPress={() => deleteMutation.mutate()}>
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
