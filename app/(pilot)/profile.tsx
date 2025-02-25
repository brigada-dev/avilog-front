import { Stack } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';

export default function ProfileRoute() {
  const router = useRouter();
  const [decimalFormat, setDecimalFormat] = React.useState(false);
  return (
    <>
      <Layout variant="tertiary">
        <Header title="Profile" />
        <ScrollView>
          <View className="mb-4">
            {/* Input Fields */}
            <View>
              <View className="mb-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Name</Text>
                <TextInput placeholder="Write your name here.." className="text-gray-800" />
              </View>

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Surname</Text>
                <TextInput placeholder="Write your surname here.." className="text-gray-800" />
              </View>

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Email</Text>
                <TextInput placeholder="Write your email here.." className="text-gray-800" />
              </View>

              {/* Language Selector */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Language</Text>
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: 'https://flagcdn.com/w40/se.png' }}
                    className="mr-2 h-4 w-6"
                  />
                  <Text>Swedish</Text>
                </View>
              </View>

              {/* Standard Style */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Standard style</Text>
                <View className="flex-row items-center justify-between">
                  <Text>EASA</Text>
                  <Feather name="chevron-down" size={20} color="#23d013" />
                </View>
              </View>

              {/* Decimal Format Toggle */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="italic text-gray-600">Decimal format</Text>
                    <Text className="text-sm text-gray-400">(1,5 instead of 1:30)</Text>
                  </View>
                  <Switch
                    value={decimalFormat}
                    onValueChange={setDecimalFormat}
                    trackColor={{ false: '#e4e4e7', true: '#23d013' }}
                  />
                </View>
              </View>

              {/* Logbook Import/Export */}
              <View className="mb-4 flex-row">
                <TouchableOpacity className="mr-4 flex-1 items-center rounded-xl bg-white p-4 shadow-sm">
                  <Text className="mt-2 text-center">Import logbook</Text>
                  <Image
                    source={require('../../assets/images/logbook_in.png')}
                    style={{ flex: 1 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center rounded-xl bg-white p-4 shadow-sm">
                  <Text className="mt-2 text-center">Export logbook</Text>
                  <Image
                    source={require('../../assets/images/logbook_out.png')}
                    style={{ flex: 1 }}
                  />
                </TouchableOpacity>
              </View>

              {/* Signature */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 text-gray-600">Signature</Text>
                <TextInput placeholder="Write your signature here.." className="text-gray-800" />
              </View>

              {/* Licenses */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <View className="mb-4 flex-row justify-between">
                  <Text className="font-semibold">Licenses</Text>
                  <Text className="font-semibold">Expires</Text>
                </View>
                {[
                  { license: 'CPL-A', expires: 'N/A' },
                  { license: 'IR-A', expires: '28/05/2025' },
                  { license: 'SAAB2000', expires: '28/05/2025' },
                  { license: 'Medical class 1', expires: '18/04/2025' },
                ].map((item, index) => (
                  <View key={index} className="flex-row justify-between py-2">
                    <Text className="text-gray-800">{item.license}</Text>
                    <Text className="text-gray-800">{item.expires}</Text>
                  </View>
                ))}
                <TouchableOpacity className="mt-4 flex-row items-center justify-center rounded-full border border-green-500 py-2">
                  <Text className="mr-2 text-green-500">+</Text>
                  <Text className="text-green-500">Add license</Text>
                </TouchableOpacity>
              </View>

              {/* Training */}
              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 font-semibold text-gray-800">Training</Text>
                <Image
                  source={require('../../assets/images/paper-plane-flying.png')}
                  style={{ position: 'absolute', top: 16, right: 20 }}
                />
                <Image
                  source={require('../../assets/images/training.png')}
                  style={{ height: 128, width: 'auto' }}
                  resizeMode="contain"
                />
              </View>

              <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <View className="bg-gray-900 p-4">
                  <Text className="text-center text-lg font-semibold text-white">SUBSCRIPTION</Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/images/subscription.png')}
                    style={{ width: 'auto', height: 300 }}
                  />
                  <Text className="absolute right-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold">
                    €9<Text className="text-lg">/mo</Text>
                  </Text>
                </View>

                <View className="p-4 bg-white shadow-sm">
                  <View className="flex-row">
                    <Image
                      source={require('../../assets/images/calendar.png')}
                      style={{ height: 42, width: 42 }}
                    />
                    <View className="ml-2">
                      <Text className="mb-2 text-gray-600">Next payment</Text>
                      <Text className="mb-4 text-gray-800">28 feb. 25</Text>
                    </View>
                  </View>
                  <Button
                    title="Connect to school"
                    iconLeft={require('../../assets/images/connect.png')}
                    style={{
                      borderRadius: 16,
                      borderColor: '#C4C4C4',
                      borderWidth: 1,
                      width: 'auto',
                      marginTop: 12,
                    }}
                  />
                  <Button
                    title="Manage account"
                    iconLeft={require('../../assets/images/cog.png')}
                    style={{
                      borderRadius: 16,
                      borderColor: '#C4C4C4',
                      borderWidth: 1,
                      width: 'auto',
                      marginTop: 12,
                    }}
                  />
                </View>
              </View>

              {/* Support */}
              <View className="mb-8 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-1 text-gray-600">Support</Text>
                <Text className="text-gray-800">support@avilog.io</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
}
