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

export default function AddAircraft() {
  const [isAircraft, setIsAircraft] = useState(true);
  const [isSimulator, setIsSimulator] = useState(false);
  const [engineType, setEngineType] = useState('Turboprop');
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
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ADD AIRCRAFT</Text>

      <TextInput style={styles.input} placeholder="Registration" />

      {/* Aircraft / Simulator Switch */}
      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Aircraft</Text>
          <Switch value={isAircraft} onValueChange={(val) => setIsAircraft(val)} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Simulator</Text>
          <Switch value={isSimulator} onValueChange={(val) => setIsSimulator(val)} />
        </View>
      </View>

      {/* Aircraft Type */}
      <View style={styles.dropdownContainer}>
        <TextInput style={styles.dropdownInput} placeholder="Aircraft Type" />
        <Ionicons name="list" size={24} color="#333" />
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={20} color="green" />
        <Text style={styles.addButtonText}>Add new aircraft type</Text>
      </TouchableOpacity>

      {/* Engine Type Selection */}
      <View style={styles.engineContainer}>
        {['Glider', 'Turboprop', 'Piston', 'Jet'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.engineButton,
              engineType === type ? styles.selectedEngine : null,
            ]}
            onPress={() => setEngineType(type)}>
            <Text style={engineType === type ? styles.selectedText : styles.unselectedText}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Multi Engine & Multi Pilot Switches */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Single engine</Text>
        <Switch value={!multiEngine} onValueChange={(val) => setMultiEngine(!val)} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Multi engine</Text>
        <Switch value={multiEngine} onValueChange={(val) => setMultiEngine(val)} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Multi pilot</Text>
        <Switch value={multiPilot} onValueChange={(val) => setMultiPilot(val)} />
      </View>

      {/* Remarks */}
      <TextInput
        style={styles.remarksInput}
        placeholder="Add a remark"
        value={remarks}
        onChangeText={setRemarks}
      />
      <TouchableOpacity style={styles.createRemarkButton}>
        <Text style={styles.createRemarkText}>Create new remark</Text>
      </TouchableOpacity>

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={50} color="green" />
        )}
        <Text style={styles.imagePickerText}>Add Image</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Ionicons name="airplane" size={20} color="white" />
        <Text style={styles.saveButtonText}>Save Aircraft</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#D0FFD6',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
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
  engineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
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
    color: 'green',
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
});
