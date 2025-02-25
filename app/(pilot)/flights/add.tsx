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
import { Stack, useRouter } from 'expo-router';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import AdjustModal from '~/components/AdjustModal';

// Initial Flight Data (for creating a new flight)
const initialFlight = {
  registration: '',
  type: '',
  date: format(new Date(), 'dd/MM/yy'), // Today's date
  from: '',
  to: '',
  depTime: format(new Date(), 'HH:mm'), // Current time
  arrTime: format(new Date(), 'HH:mm'), // Current time
  duration: '0:00',
  depFlag: null, // You might want to provide default flags
  arrFlag: null,
  landings: 0,
  approachType: '',
  timezone: 'UTC', // Or get the device's timezone
  aircraft: {
    type: '',
    imageUrl: null,
    flightTime: '0:00',
    flights: 0,
  },
  crew: {
    sic: '',
    pic: '',
  },
  summary: {
    total: '0:00',
    sic: '0:00',
    mp: '0:00',
    ifr: '0:00',
    xc: '0:00',
  },
};

export default function CreateFlight() {
  const router = useRouter();
  const [flight, setFlight] = useState(initialFlight);

  const flightDate = parse(flight.date, 'dd/MM/yy', new Date());
  const [fromDate, setFromDate] = useState(flightDate);
  const [toDate, setToDate] = useState(flightDate);
  const [depTime, setDepTime] = useState(parse(flight.depTime, 'HH:mm', fromDate));
  const [arrTime, setArrTime] = useState(parse(flight.arrTime, 'HH:mm', fromDate));
  const [duration, setDuration] = useState(flight.duration);
  const [isAdjustModalVisible, setAdjustModalVisible] = useState(false);

  const handleSaveAdjustments = (updatedSummary: any) => {
    setFlight((prev) => ({
      ...prev,
      summary: updatedSummary,
    }));
    setAdjustModalVisible(false);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (!selectedDate) return;
    type === 'from' ? setFromDate(selectedDate) : setToDate(selectedDate);
    setFlight({ ...flight, date: format(selectedDate, 'dd/MM/yy') }); // Update flight date
  };

  const handleTimeChange = (
    event: any,
    selectedDate: Date | undefined,
    type: 'depTime' | 'arrTime'
  ) => {
    if (!selectedDate) return;

    if (type === 'depTime') {
      setDepTime(selectedDate);
      setFlight({ ...flight, depTime: format(selectedDate, 'HH:mm') });
    } else {
      setArrTime(selectedDate);
      setFlight({ ...flight, arrTime: format(selectedDate, 'HH:mm') });

      if (isBefore(selectedDate, depTime)) {
        setToDate(addDays(fromDate, 1));
        setFlight({ ...flight, date: format(addDays(fromDate, 1), 'dd/MM/yy') }); // Update date if arrival is before departure
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

  const handleInputChange = (field: string, value: string, nestedField?: string) => {
    setFlight((prevFlight) => {
      const updatedFlight = { ...prevFlight };
      if (nestedField) {
        updatedFlight[nestedField][field] = value;
      } else {
        updatedFlight[field] = value;
      }
      return updatedFlight;
    });
  };

  const handleSaveFlight = () => {
    // Here you would typically send the 'flight' data to your API
    console.log('Flight data to be submitted:', flight);

    // Simulate API call delay
    setTimeout(() => {
      alert('Flight created successfully!'); // Or a better user feedback mechanism
      router.push('/flights'); // Navigate back to the flights list or wherever you want
    }, 1000); // Simulate 1-second delay
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="tertiary">
        <Header title="Create Flight" />

        <ScrollView>
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="flex-row justify-between">
              <Text className="text-base font-normal">Departure</Text>
              <Text className="text-base font-normal">Arrival</Text>
            </View>

            <View className="mt-2 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
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
              <Image source={require('../../../assets/images/calendar.png')} style={styles.icon} />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 32, width: 32 }}
              />
              <TextInput
                value={flight.from}
                className="flex-1 text-lg font-medium"
                onChangeText={(text) => handleInputChange('from', text)}
              />

              <Image
                source={{ uri: flight.depFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <Image source={require('../../../assets/images/paper-plane.png')} />
              <Image
                source={{ uri: flight.arrFlag }}
                style={{ height: 32, width: 32, borderRadius: 60 }}
              />
              <TextInput
                value={flight.to}
                className="flex-1 text-lg font-medium"
                onChangeText={(text) => handleInputChange('to', text)}
              />
              <Image
                source={require('../../../assets/images/pin.png')}
                style={{ height: 36, width: 36 }}
              />
            </View>
            <View className="mt-2 h-px w-full bg-black/10" />

            <View className="mt-4 flex-row items-center justify-between">
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
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
              <Image source={require('../../../assets/images/klok.png')} style={styles.icon} />
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
                        source={require('../../../assets/images/image_placeholder.png')}
                        style={{ height: 80, width: 80 }}
                      />
                    </View>
                  </View>
                )}
              </View>
              <View className="flex-1 p-4">
                <View>
                  <Text className="text-lg font-bold">{flight.registration}</Text>
                  <TextInput
                    value={flight.aircraft.type}
                    className="text-lg font-medium"
                    onChangeText={(text) => handleInputChange('type', text, 'aircraft')} // Nested field
                  />
                </View>
                <View className="flex flex-row gap-2 pt-2">
                  <View className="flex-row items-center">
                    <Image
                      source={require('../../../assets/images/clock.png')}
                      style={{ height: 24, width: 24 }}
                    />
                    <Text className="text-sm font-bold">{flight.aircraft.flightTime}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Image
                      source={require('../../../assets/images/landing.png')}
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
              iconLeft={require('../../../assets/images/edit.png')}
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
              iconLeft={require('../../../assets/images/edit.png')}
              onPress={() => setAdjustModalVisible(true)}
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
              iconLeft={require('../../../assets/images/edit.png')}
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveFlight}>
              <Ionicons name="airplane-outline" size={24} color="white" />
              <Text style={styles.saveButtonText}>Create Flight</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
      <AdjustModal
        visible={isAdjustModalVisible}
        onClose={() => setAdjustModalVisible(false)}
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
