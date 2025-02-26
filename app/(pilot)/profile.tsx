import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
  Keyboard,
} from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';
import { useAuth } from '~/context/auth-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dropdown } from 'react-native-element-dropdown';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  standard_style: z.array(z.string()).nonempty('Select at least one standard'),
});

type UserType = z.infer<typeof userSchema>;
const standardOptions = [
  { label: 'EASA', value: 'EASA' },
  { label: 'FAA', value: 'FAA' },
  { label: 'ICAO', value: 'ICAO' },
  { label: 'CAA', value: 'CAA' },
  { label: 'DGCA', value: 'DGCA' },
];

export default function ProfileRoute() {
  const { signOut, user } = useAuth();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      standard_style: user.standard_style,
    },
  });
  const [decimalFormat, setDecimalFormat] = React.useState(false);
  return (
    <>
      <Layout variant="tertiary">
        <Header title="Profile" />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="mb-4">
            {/* Input Fields */}
            <View>
              <View className="mb-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Name</Text>
                <TextInput placeholder="Write your name here.." className="text-gray-800" />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="text-gray-800"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoComplete="name-given"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
              </View>

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Surname</Text>
                <Controller
                  control={control}
                  name="surname"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="text-gray-800"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoComplete="name-given"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
              </View>

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="text-gray-800"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoComplete="name-given"
                      autoCorrect={false}
                      editable={false}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
              </View>

              {/* <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-2 italic text-gray-600">Language</Text>
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: 'https://flagcdn.com/w40/us.png' }}
                    className="mr-2 h-4 w-6"
                  />
                  <Controller
                    control={control}
                    name="language"
                    render={({ field: { onChange, value } }) => <Text>{value}</Text>}
                  />
                  {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
                </View>
              </View> */}

              <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <Controller
                  control={control}
                  name="standard_style"
                  render={({ field: { onChange, value = '' } }) => (
                    <View style={{ marginBottom: 10 }}>
                      <Text className="mb-2 italic text-gray-600">Email</Text>
                      <Dropdown
                        style={{
                          borderRadius: 8,
                          justifyContent: 'center', // Centers text inside
                          backgroundColor: 'white', // Ensures visibility
                        }}
                        containerStyle={{
                          borderRadius: 16,
                          shadowOffset: {width: 0, height:0},
                          overflow: 'hidden'
                        }}
                        placeholderStyle={{
                          color: 'gray',
                          fontSize: 16,
                        }}
                        selectedTextStyle={{
                          color: 'black',
                          fontSize: 16,
                          paddingTop: 10, // Increases tappable area
                        }}
                        data={standardOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Standard Style"
                        value={value}
                        onChange={(item) => {
                          console.log('Dropdown Selected:', item);
                          onChange(item.value);
                          setValue('standard_style', item.value);
                        }}
                        renderItem={(item, selected) => (
                          <View
                            style={{
                              paddingVertical: 12, // Expands tap area
                              paddingHorizontal: 10,
                              backgroundColor: selected ? '#ddd' : 'white',
                            }}>
                            <Text style={{ fontSize: 16 }}>{item.label}</Text>
                          </View>
                        )}
                      />
                    </View>
                  )}
                />
                {errors.standard_style && (
                  <Text className="text-red-500">{errors.standard_style.message}</Text>
                )}
              </View>

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

                <View className="bg-white p-4 shadow-sm">
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

              <View className="mb-8 rounded-xl bg-white p-4 shadow-sm">
                <Button
                  onPress={signOut}
                  title="Logout"
                  iconLeft={require('../../assets/images/landing.png')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
}
