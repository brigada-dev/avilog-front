import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

// Flight Data
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

export default function EditFlight() {
  const { id } = useLocalSearchParams();
  const flight = flights.find((f) => f.id.toString() === id);

  if (!flight) {
    return (
      <Layout variant="secondary">
        <Header title="Flight Not Found" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Flight not found</Text>
        </View>
      </Layout>
    );
  }

  const [date, setDate] = useState(flight.date);
  const [from, setFrom] = useState(flight.from);
  const [to, setTo] = useState(flight.to);
  const [depTime, setDepTime] = useState(flight.depTime);
  const [arrTime, setArrTime] = useState(flight.arrTime);
  const [duration, setDuration] = useState(flight.duration);
  const [landings, setLandings] = useState(flight.landings);
  const [approachType, setApproachType] = useState(flight.approachType);
  const [pic, setPic] = useState(flight.crew.pic);
  const [sic, setSic] = useState(flight.crew.sic);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title="Edit Flight" />

        <ScrollView>
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            {/* Date Selection */}
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="mt-2 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
              <TextInput className="text-lg font-medium" value={date} onChangeText={setDate} />
              <View className="h-full w-px bg-black/10" />
              <TextInput className="text-lg font-medium" value={date} onChangeText={setDate} />
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
            </View>

            {/* Airport Selection */}
            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/pin.png')}
                style={styles.smallIcon}
              />
              <TextInput className="text-lg font-medium" value={from} onChangeText={setFrom} />
              <Image source={{ uri: flight.depFlag }} style={styles.flag} />
              <Image source={require('../../../../assets/images/paper-plane.png')} />
              <Image source={{ uri: flight.arrFlag }} style={styles.flag} />
              <TextInput className="text-lg font-medium" value={to} onChangeText={setTo} />
              <Image
                source={require('../../../../assets/images/pin.png')}
                style={styles.smallIcon}
              />
            </View>

            {/* Flight Times */}
            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
              <TextInput
                className="text-center text-lg"
                value={depTime}
                onChangeText={setDepTime}
              />
              <Text className="text-lg text-green-600">{flight.timezone}</Text>
              <TextInput
                className="text-center text-lg"
                value={duration}
                onChangeText={setDuration}
              />
              <Text className="text-lg text-green-600">{flight.timezone}</Text>
              <TextInput
                className="text-center text-lg"
                value={arrTime}
                onChangeText={setArrTime}
              />
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
            </View>
          </View>

          {/* Landings */}
          <View className="mb-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-bold">Landings</Text>
            <View className="mt-2 flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setLandings((prev) => Math.max(0, prev - 1))}>
                <Ionicons name="remove-circle-outline" size={32} color="green" />
              </TouchableOpacity>
              <Text className="text-lg font-medium">{landings}</Text>
              <TouchableOpacity onPress={() => setLandings((prev) => prev + 1)}>
                <Ionicons name="add-circle-outline" size={32} color="green" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Crew Details */}
          <View className="mb-4 rounded-xl bg-white p-4">
            <Text className="text-lg font-bold">Crew</Text>
            <TextInput
              className="mt-2 text-lg font-medium"
              value={sic}
              onChangeText={setSic}
              placeholder="SIC"
            />
            <TextInput
              className="mt-2 text-lg font-medium"
              value={pic}
              onChangeText={setPic}
              placeholder="PIC"
            />
          </View>

          {/* Save Button */}
          <View className="mt-6 items-center">
            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="airplane-outline" size={24} color="white" />
              <Text style={styles.saveButtonText}>Save Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  icon: { height: 42, width: 42 },
  smallIcon: { height: 32, width: 32 },
  flag: { height: 32, width: 32, borderRadius: 60 },
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
