import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AircraftFormData, aircraftSchema } from '~/api/aircrafts';
import { createAircraft, updateAircraft } from '~/api/aircrafts';
import { useAuth } from '~/context/auth-context';
import { Button } from '~/components/Button';
import { Header } from '~/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';

export default function AircraftForm({
  aircraft,
  isEdit,
}: {
  aircraft?: AircraftFormData;
  isEdit: boolean;
}) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Form setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AircraftFormData>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: {
      registration: aircraft?.registration || '',
      is_aircraft: aircraft?.is_aircraft ?? true,
      is_simulator: aircraft?.is_simulator ?? false,
      type: aircraft?.type || '',
      engine_type: aircraft?.engine_type || 'Piston',
      is_multi_engine: aircraft?.is_multi_engine ?? false,
      is_multi_pilot: aircraft?.is_multi_pilot ?? false,
      remarks: aircraft?.remarks || '',
      image_url: aircraft?.image_url || null,
    },
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: AircraftFormData) => createAircraft(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries(['aircrafts']);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: AircraftFormData) => updateAircraft(aircraft!.id!, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries(['aircrafts']);
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
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <ScrollView>
      <View className="mb-4 rounded-xl bg-[#F5F5F5] p-4">
        <Header title={isEdit ? 'EDIT AIRCRAFT' : 'ADD AIRCRAFT'} />

        {/* Registration */}
        <Controller
          control={control}
          name="registration"
          render={({ field: { onChange, value } }) => (
            <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <Text className="mb-2 text-gray-600">Registration</Text>
              <TextInput
                className="py-2 font-bold text-gray-800"
                value={value}
                onChangeText={onChange}
              />
              {errors.registration && (
                <Text className="text-red-500">{errors.registration.message}</Text>
              )}
            </View>
          )}
        />

        {/* Aircraft / Simulator Switch */}
        <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Aircraft</Text>
              <Controller
                control={control}
                name="is_aircraft"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Simulator</Text>
              <Controller
                control={control}
                name="is_simulator"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
          </View>
        </View>
        <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
          <View className="flex-row items-center">
            <View className="w-full border-b border-[#DBDADA] p-4">
              <Text className="mb-2 text-gray-600">Aircraft Type</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="py-2 font-bold text-gray-800"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            <View className="absolute right-4">
              <Ionicons name="list" size={24} color="#23D013" />
            </View>
          </View>
          <Button
            title="Add new aircraft type"
            iconLeft={require('../../assets/images/front_plane.png')}
            className="my-4 border border-[#DBDADA]"
          />
        </View>
        <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-6">
          <Text className="pl-4 pt-4">Engine type</Text>
          <View className="flex-1 flex-row flex-wrap justify-between">
            {['Glider', 'Turboprop', 'Piston', 'Jet'].map((engineType) => (
              <Controller
                key={engineType}
                control={control}
                name="engine_type"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center gap-2 p-2">
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
        </View>
        {/* Remarks */}
        <Controller
          control={control}
          name="remarks"
          render={({ field: { onChange, value } }) => (
            <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
              <Text className="mb-2 text-gray-600">Remarks</Text>
              <TextInput
                className="py-2 font-bold text-gray-800"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />
        <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Single Engine</Text>
              <Controller
                control={control}
                name="is_multi_engine"
                render={({ field: { onChange, value } }) => (
                  <Switch value={!value} onValueChange={(val) => onChange(!val)} />
                )}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Multi Engine</Text>
              <Controller
                control={control}
                name="is_multi_engine"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
          </View>
        </View>

        <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Multi Pilot</Text>
            <Controller
              control={control}
              name="is_multi_pilot"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
        </View>
        <Controller
          control={control}
          name="remarks"
          render={({ field: { onChange, value } }) => (
            <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
              <View className="relative w-full border-b border-[#DBDADA] p-4">
                <Text className="mb-2 text-gray-600">Remarks</Text>
                <TextInput
                  className="flex-1 py-2 font-bold text-gray-800"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            </View>
          )}
        />
        <Button title="Create remark" className="my-4 border border-[#DBDADA]" />
        {/* Image Picker */}
        <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
          <Controller
            control={control}
            name="image_url"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity onPress={() => pickImage()} className="flex-1">
                {value ? (
                  <View className="flex-row">
                    <View className="flex-1">
                      <Image source={{ uri: value }} style={{ height: 128, borderRadius: 16 }} />
                    </View>
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="add-circle-outline" size={80} color="#34C759" />
                      <Text style={styles.imagePickerText} className="text-lg">
                        Change Image
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row">
                    <View className="flex-1 items-center justify-center">
                      <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                        <Image
                          source={require('../../assets/images/image_placeholder.png')}
                          style={{ height: 80, width: 80 }}
                        />
                      </View>
                    </View>
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="add-circle-outline" size={80} color="#34C759" />
                      <Text style={styles.imagePickerText} className="text-lg">
                        Add Image
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        <View
          className="flex-1 items-center justify-center"
          style={{ marginBottom: 32, marginTop: 16 }}>
          <TouchableOpacity style={[styles.button]} onPress={handleSubmit(onSubmit)}>
            <Image
              source={require('../../assets/images/white_plane.png')}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text style={styles.buttonText}>{isEdit ? 'Update Aircraft' : 'Save Aircraft'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
