import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { GradientBackground } from '~/components/ui/GradientBackground';
import { Container } from '~/components/Container';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';
import Checkbox from 'expo-checkbox';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AircraftFormData, aircraftSchema, createAircraft } from '~/api/aircrafts';
import { useAuth } from '~/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';

export default function EditAircraft() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AircraftFormData>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: {
      registration: '',
      is_aircraft: true,
      is_simulator: false,
      type: '',
      engine_type: undefined,
      is_multi_engine: false,
      is_multi_pilot: false,
      remarks: '',
      image_url: null,
    },
  });
  const createMutation = useMutation({
    mutationFn: (data: AircraftFormData) => createAircraft(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircrafts'] });
      reset();
      router.push('/aircrafts');
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setValue('image_url', result.assets[0].uri);
    }
  };

  const onSubmit = (data: AircraftFormData) => {
    createMutation.mutate(data);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GradientBackground variant="secondary">
        <ScrollView>
          <Container>
            <View className="mb-4 rounded-xl bg-[#F5F5F5] p-4">
              <Header title="ADD AIRCRAFT" />

              <Controller
                control={control}
                name="registration"
                render={({ field: { onChange, value } }) => (
                  <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
                    <Text className="mb-2 text-gray-600">Registration</Text>
                    <TextInput
                      className="flex-1 py-2 font-bold text-gray-800"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.registration && (
                      <Text className="text-red-500">{errors.registration.message}</Text>
                    )}
                  </View>
                )}
              />

              <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
                <View style={styles.switchContainer}>
                  <View style={styles.switchRow}>
                    <Controller
                      control={control}
                      name="is_aircraft"
                      render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                      )}
                    />
                    <Text style={styles.switchLabel}>Aircraft</Text>
                  </View>
                  <View style={styles.switchRow}>
                    <Controller
                      control={control}
                      name="is_simulator"
                      render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                      )}
                    />
                    <Text style={styles.switchLabel}>Simulator</Text>
                  </View>
                </View>
              </View>

              <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
                <View className="flex-row items-center">
                  <View className="w-full border-b border-[#DBDADA] p-4">
                    <Text className="mb-2 text-gray-600">Aircraft type</Text>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="flex-1 py-2 font-bold text-gray-800"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {errors.type && <Text className="text-red-500">{errors.type.message}</Text>}
                  </View>
                  <View className="absolute right-4">
                    <Ionicons name="list" size={24} color="#23D013" />
                  </View>
                </View>
                <Button
                  title="Add new aircraft type"
                  iconLeft={require('../../../assets/images/front_plane.png')}
                  className="my-4 border border-[#DBDADA]"
                />
              </View>
              <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white">
                <View className="pl-4 pt-4">
                  <Text className="">Engine type</Text>
                </View>
                <View className="flex-1 flex-col items-start justify-between gap-4 p-6">
                  {['Glider', 'Turboprop', 'Piston', 'Jet'].map((engineType) => (
                    <Controller
                      key={engineType}
                      control={control}
                      name="engine_type"
                      render={({ field: { onChange, value } }) => (
                        <View className="flex-1 flex-row items-center gap-2">
                          <Checkbox
                            value={value === engineType}
                            onValueChange={() => onChange(engineType)}
                            color={value === engineType ? '#34C759' : undefined}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              borderColor: '#DBDADA',
                              borderWidth: 1,
                            }}
                          />
                          <Text className="text-lg">{engineType}</Text>
                        </View>
                      )}
                    />
                  ))}
                </View>
                {errors.engine_type && (
                  <Text className="px-4 pb-4 text-red-500">{errors.engine_type.message}</Text>
                )}
              </View>

              <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
                <View style={styles.switchContainer}>
                  <View style={styles.switchRow}>
                    <Controller
                      control={control}
                      name="is_multi_engine"
                      render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                      )}
                    />
                    <Text style={styles.switchLabel}>Multi engine</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
                <View style={styles.switchRow}>
                  <Controller
                    control={control}
                    name="is_multi_pilot"
                    render={({ field: { onChange, value } }) => (
                      <Switch value={value} onValueChange={onChange} />
                    )}
                  />
                  <Text style={styles.switchLabel}>Multi pilot</Text>
                </View>
              </View>

              <Controller
                control={control}
                name="remarks"
                render={({ field: { onChange, value } }) => (
                  <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
                    <View className="flex-row items-center">
                      <View className="relative w-full border-b border-[#DBDADA] p-4">
                        <Text className="mb-2 text-gray-600">Remarks</Text>
                        <TextInput
                          className="flex-1 py-2 font-bold text-gray-800"
                          value={value}
                          onChangeText={onChange}
                        />
                        {errors.remarks && (
                          <Text className="text-red-500">{errors.remarks.message}</Text>
                        )}
                      </View>
                    </View>
                    <Button title="Create remark" className="my-4 border border-[#DBDADA]" />
                  </View>
                )}
              />

              {/* Image Picker */}
              <Controller
                control={control}
                name="image_url"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
                    <View className="flex-1 flex-row">
                      {value ? (
                        <TouchableOpacity onPress={() => pickImage()} className="flex-1">
                          <View className="flex-1 flex-row">
                            <View className="flex-1">
                              <Image
                                source={{ uri: value }}
                                style={{ height: 128, borderRadius: 16 }}
                              />
                            </View>
                            <View className="flex-1 items-center justify-center">
                              <Ionicons name="add-circle-outline" size={80} color="#34C759" />
                              <Text style={styles.imagePickerText} className="text-lg">
                                Change Image
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => pickImage()} className="flex-1">
                          <View className="flex-row">
                            <View className="flex-1 items-center justify-center">
                              <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                                <Image
                                  source={require('../../../assets/images/image_placeholder.png')}
                                  style={{ height: 80, width: 80 }}
                                />
                              </View>
                            </View>
                            <View className="flex-1 items-center justify-center">
                              <Ionicons name="add-circle-outline" size={80} color="#34C759" />
                              <Text style={styles.imagePickerText} className="text-lg">
                                Add image
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />
              <View
                className="flex-1 items-center justify-center"
                style={{ marginBottom: 32, marginTop: 16 }}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={[styles.button]}>
                  <Image
                    source={require('../../../assets/images/white_plane.png')}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Save aircraft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Container>
        </ScrollView>
      </GradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#D0FFD6',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2ED013',
    borderRadius: 16,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    gap: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  dropdownInput: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'green',
    marginLeft: 5,
  },

  engineButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedEngine: {
    backgroundColor: 'green',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: 'black',
  },
  remarksInput: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  createRemarkButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  createRemarkText: {
    color: 'white',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  imagePickerText: {
    color: 'gray',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});
