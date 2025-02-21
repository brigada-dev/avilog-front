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
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackgroundSecondary } from '~/components/ui/GradientBackground';
import { Container } from '~/components/Container';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';
import Checkbox from 'expo-checkbox';

const aircrafts = [
  {
    id: 1,
    registration: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '275:30',
    flights: 125,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 2,
    registration: 'OY-FSC',
    type: 'SAAB 2000',
    flightTime: '110:40',
    flights: 75,
    imageUrl: null,
  },
  {
    id: 3,
    registration: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '108:25',
    flights: 88,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 4,
    registration: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '52:10',
    flights: 32,
    imageUrl: null,
  },
];

export default function EditAircraft() {
  const { id } = useLocalSearchParams();
  const aircraft = aircrafts.find((a) => a.id.toString() === id);
  const [isAircraft, setIsAircraft] = useState(true);
  const [isSimulator, setIsSimulator] = useState(false);
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const toggleCheckbox = (type: string) => {
    setSelected((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const [multiEngine, setMultiEngine] = useState(true);
  const [multiPilot, setMultiPilot] = useState(true);
  const [imageUri, setImageUri] = useState('');
  const [remarks, setRemarks] = useState('');

  // Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <GradientBackgroundSecondary>
      <ScrollView>
        <Container>
          <View className="mb-4 rounded-xl bg-[#F5F5F5] p-4">
            <Header title="EDIT AIRCRAFT" />
            <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <Text className="mb-2 text-gray-600">Registration</Text>
              <TextInput
                className="flex-1 py-2 font-bold text-gray-800"
                defaultValue={aircraft?.registration}
              />
            </View>
            <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <Switch value={isAircraft} onValueChange={(val) => setIsAircraft(val)} />
                  <Text style={styles.switchLabel}>Aircraft</Text>
                </View>
                <View style={styles.switchRow}>
                  <Switch value={isSimulator} onValueChange={(val) => setIsSimulator(val)} />
                  <Text style={styles.switchLabel}>Simulator</Text>
                </View>
              </View>
            </View>
            <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
              <View className="flex-row items-center">
                <View className="w-full border-b border-[#DBDADA] p-4">
                  <Text className="mb-2 text-gray-600">Registration</Text>
                  <TextInput
                    className="flex-1 py-2 font-bold text-gray-800"
                    defaultValue={aircraft?.registration}
                  />
                </View>
                <View className="absolute right-4">
                  <Ionicons name="list" size={24} color="#23D013" />
                </View>
              </View>
              <Button
                title="Add new aircraft type"
                iconLeft={require('../../../../assets/images/front_plane.png')}
                className="my-4 border border-[#DBDADA]"
              />
            </View>
            <View className="my-4 w-full rounded-2xl border border-[#DBDADA] bg-white">
              <View className="pl-4 pt-4">
                <Text className="">Engine type</Text>
              </View>
              <View className="flex-1 flex-col items-start justify-between gap-4 p-6">
                <View className="w-full flex-1 flex-row justify-between">
                  <View className="flex-1 flex-row items-start gap-2">
                    <Checkbox
                      value={selected['Glider'] || false}
                      onValueChange={() => toggleCheckbox('Glider')}
                      color={selected['Glider'] ? '#34C759' : undefined}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        borderColor: '#DBDADA',
                        borderWidth: 1,
                      }}
                    />
                    <Text className="text-lg">Glider</Text>
                  </View>
                  <View className="flex-1 flex-row items-center gap-2">
                    <Checkbox
                      value={selected['Turboprop'] || false}
                      onValueChange={() => toggleCheckbox('Turboprop')}
                      color={selected['Turboprop'] ? '#34C759' : undefined}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        borderColor: '#DBDADA',
                        borderWidth: 1,
                      }}
                    />
                    <Text className="text-lg">Turboprop</Text>
                  </View>
                </View>
                <View className="w-full flex-1 flex-row justify-start">
                  <View className="flex-1 flex-row items-center gap-2">
                    <Checkbox
                      value={selected['Piston'] || false}
                      onValueChange={() => toggleCheckbox('Piston')}
                      color={selected['Piston'] ? '#34C759' : undefined}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        borderColor: '#DBDADA',
                        borderWidth: 1,
                      }}
                    />
                    <Text className="text-lg">Piston</Text>
                  </View>
                  <View className="flex-1 flex-row items-center gap-2">
                    <Checkbox
                      value={selected['Jet'] || false}
                      onValueChange={() => toggleCheckbox('Jet')}
                      color={selected['Jet'] ? '#34C759' : undefined}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        borderColor: '#DBDADA',
                        borderWidth: 1,
                      }}
                    />
                    <Text className="text-lg">Jet</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <Switch value={!multiEngine} onValueChange={(val) => setMultiEngine(!val)} />
                  <Text style={styles.switchLabel}>Single engine</Text>
                </View>
                <View style={styles.switchRow}>
                  <Switch value={multiEngine} onValueChange={(val) => setMultiEngine(val)} />
                  <Text style={styles.switchLabel}>Multi engine</Text>
                </View>
              </View>
            </View>
            <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <View style={styles.switchRow}>
                <Switch value={multiPilot} onValueChange={(val) => setMultiPilot(val)} />
                <Text style={styles.switchLabel}>Multi pilot</Text>
              </View>
            </View>

            <View className="my-4 w-full items-center rounded-2xl border border-[#DBDADA] bg-white">
              <View className="flex-row items-center">
                <View className="relative w-full border-b border-[#DBDADA] p-4">
                  <Text className="mb-2 text-gray-600">Remarks</Text>
                  <TextInput className="flex-1 py-2 font-bold text-gray-800" />
                </View>
              </View>
              <Button
                title="Create remark"
                // iconLeft={<FontAwesome5 name="hashtage" size={32} />}
                className="my-4 border border-[#DBDADA]"
              />
            </View>
            <View className="mb-4 mt-4 w-full rounded-2xl border border-[#DBDADA] bg-white p-4">
              <View className="flex-1 flex-row">
                {aircraft?.imageUrl !== null || imageUri.length !== 0 ? (
                  <TouchableOpacity onPress={() => pickImage()} className="flex-1">
                    <View className="flex-1 flex-row">
                      <View className="flex-1">
                        <Image
                          source={{
                            uri: aircraft?.imageUrl !== null ? aircraft?.imageUrl : imageUri,
                          }}
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
                            source={require('../../../../assets/images/image_placeholder.png')}
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
            <View
              className="flex-1 items-center justify-center"
              style={{ marginBottom: 32, marginTop: 16 }}>
              <TouchableOpacity style={[styles.button]}>
                <Image
                  source={require('../../../../assets/images/white_plane.png')}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Save aircraft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </ScrollView>
    </GradientBackgroundSecondary>
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
