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
import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  parse,
  format,
  addDays,
  differenceInMinutes,
  setHours,
  setMinutes,
  isBefore,
} from 'date-fns';
import { Button } from '~/components/Button';
import { SummaryModal } from '~/components/summary-modal';

interface FlightSummary {
  total: string;
  sic: string;
  mp: string;
  ifr: string;
  xc: string;
  [key: string]: string; // Ensures all fields can be dynamically accessed
}
interface FlightSummary {
  'Total block time': string;
  'PIC - Pilot In Command': string;
  'SIC - Second in Command': string;
  'PICUS - PIC Under Supervision': string;
  'DUAL (Student)': string;
  Instructor: string;
  'Multi pilot': string;
  Night: string;
  'IFR - Instrument Flight Rules': string;
  'IFR - Actual IMC': string;
  'IFR Simulated - HOOD': string;
  'XC - Cross Country': string;
  'Relief pilot': string;
  Simulator: string;
}

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
  const selectedFlight = flights.find((f) => f.id.toString() === id);

  if (!selectedFlight) {
    return (
      <Layout variant="secondary">
        <Header title="Flight Not Found" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Flight not found</Text>
        </View>
      </Layout>
    );
  }

  const flightDate = parse(selectedFlight.date, 'dd/MM/yy', new Date());

  const [flight, setFlight] = useState(selectedFlight);

  const [fromDate, setFromDate] = useState(flightDate);
  const [toDate, setToDate] = useState(flightDate);
  const [depTime, setDepTime] = useState(parse(flight.depTime, 'HH:mm', fromDate));
  const [arrTime, setArrTime] = useState(parse(flight.arrTime, 'HH:mm', fromDate));
  const [duration, setDuration] = useState(flight.duration);
  const [landings, setLandings] = useState(flight.landings);
  const [pic, setPic] = useState(flight.crew.pic);
  const [sic, setSic] = useState(flight.crew.sic);
  const [isSummaryModalVisible, setSummaryModalVisible] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (!selectedDate) return;
    type === 'from' ? setFromDate(selectedDate) : setToDate(selectedDate);
  };

  const handleTimeChange = (
    event: any,
    selectedDate: Date | undefined,
    type: 'depTime' | 'arrTime'
  ) => {
    if (!selectedDate) return;

    if (type === 'depTime') {
      setDepTime(selectedDate);
    } else {
      setArrTime(selectedDate);

      if (isBefore(selectedDate, depTime)) {
        setToDate(addDays(fromDate, 1));
      } else {
        setToDate(fromDate);
      }
    }

    let diff = differenceInMinutes(arrTime, depTime);
    if (diff < 0) {
      diff += 1440;
    }

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    setDuration(`${hours}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleSaveAdjustments = (updatedSummary: FlightSummary) => {
    setFlight((prev) => ({
      ...prev,
      summary: updatedSummary,
    }));
    setAdjustModalVisible(false);
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title="Edit Flight" />

        <ScrollView>
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="mt-2 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(e, d) => handleDateChange(e, d, 'from')}
              />
              <View className="h-full w-px bg-black/10" />
              <DateTimePicker
                value={toDate}
                mode="date"
                onChange={(e, d) => handleDateChange(e, d, 'to')}
              />
              <Image
                source={require('../../../../assets/images/calendar.png')}
                style={styles.icon}
              />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../../assets/images/pin.png')}
                style={{ height: 32, width: 32 }}
              />
              <TextInput value={flight.from} className="text-lg font-medium"></TextInput>
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

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
              <DateTimePicker
                value={depTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, d) => handleTimeChange(e, d, 'depTime')}
              />
              <Text className="text-xs text-green-600">{flight.timezone}</Text>
              <Text className="text-lg font-medium">{duration}</Text>
              <Text className="text-xs text-green-600">{flight.timezone}</Text>
              <DateTimePicker
                value={arrTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, d) => handleTimeChange(e, d, 'arrTime')}
              />
              <Image source={require('../../../../assets/images/klok.png')} style={styles.icon} />
            </View>
          </View>
          <View className="mt-6 flex-1 overflow-hidden rounded-xl border border-[#DBDADA] bg-white">
            <View className="flex-row">
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
              <View className="flex-1 p-4">
                <View>
                  <Text className="text-lg font-bold">{flight.registration}</Text>
                  <Text className="text-sm">{flight.aircraft.type}</Text>
                </View>
                <View className="flex flex-row gap-2 pt-2">
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
            <View className="mt-2 h-px w-full bg-black/10" />
            <View className="p-2">
              <Text>Departure</Text>
              <View className="flex-row items-center justify-around">
                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Day</Text>
                  <View className="flex-row items-center justify-between gap-2">
                    <Feather name="plus-circle" size={42} color="#23d013" />
                    <Text className="text-xl font-bold">1</Text>
                    <Feather name="minus-circle" size={42} color="#23d013" />
                  </View>
                </View>
                <View className="flex-col items-center">
                  <Text className="text-lg font-bold">Night</Text>
                  <View className="flex-row items-center justify-between gap-2">
                    <Feather name="plus-circle" size={42} color="#23d013" />
                    <Text className="text-xl font-bold">0</Text>
                    <Feather name="minus-circle" size={42} color="#23d013" />
                  </View>
                </View>
              </View>
              <View className="mt-2 rounded-xl border border-black/10">
                <View className="border-b border-black/10 p-2">
                  <Text>Type of flight</Text>
                  <View className="justify-center">
                    <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
                    <TextInput className="text-center text-xl" value={flight.type} />
                  </View>
                </View>
                <View className="mt-2">
                  <View className="border-b border-black/10 p-2">
                    <Text>Landing</Text>
                    <View className="justify-center">
                      <Ionicons
                        name="list"
                        size={24}
                        color="#23D013"
                        className="absolute right-2"
                      />
                      <TextInput className="text-center text-xl" value={flight.approachType} />
                    </View>
                  </View>
                </View>
                <View className="mt-2 flex-row items-center justify-around pb-2">
                  <View className="flex-col items-center">
                    <Text className="text-lg font-bold">Day</Text>
                    <View className="flex-row items-center justify-between gap-2">
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      <Text className="text-xl font-bold">1</Text>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </View>
                  </View>
                  <View className="mt-2 h-full w-px bg-black/10" />

                  <View className="flex-col items-center">
                    <Text className="text-lg font-bold">Night</Text>
                    <View className="flex-row items-center justify-between gap-2">
                      <Feather name="plus-circle" size={42} color="#23d013" />
                      <Text className="text-xl font-bold">0</Text>
                      <Feather name="minus-circle" size={42} color="#23d013" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-xl bg-white p-4">
            <View className="mt-2">
              <Text>Crew</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
                <Text className="text-base font-medium">SIC</Text>
              </TouchableOpacity>
              <TextInput className="text-base" value={flight.crew.sic} />
              <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
            </View>
            <View className="mt-2 flex-row items-center gap-4">
              <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
                <Text className="text-base font-medium">PIC</Text>
              </TouchableOpacity>
              <TextInput className="text-base" value={flight.crew.pic} />
              <Ionicons name="list" size={24} color="#23D013" className="absolute right-2" />
            </View>
            <Button
              title="Add crew"
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
              onPress={() => setAdjustModalVisible(true)}
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
          <View className="mb-6 mt-6 items-center">
            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="airplane-outline" size={24} color="white" />
              <Text style={styles.saveButtonText}>Save Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
      <SummaryModal
        visible={isSummaryModalVisible}
        onClose={() => setSummaryModalVisible(false)}
        flightSummary={flight.summary}
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
