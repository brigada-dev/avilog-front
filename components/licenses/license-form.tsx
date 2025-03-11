import React, { useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fetchLicenses, createLicense, LicenseFormData } from '~/api/licenses';
import { useAuth } from '~/context/auth-context';
import { Feather } from '@expo/vector-icons';

const licenseSchema = z.object({
  licenseName: z.string().min(1, 'License name is required'),
  expiresAt: z.date(),
});

export function LicenseForm() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const { data: licenses, isLoading } = useQuery({
    queryKey: ['licenses'],
    queryFn: () => fetchLicenses(token!),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseName: '',
      expiresAt: new Date(),
    },
  });

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleAddLicense = async (data: LicenseFormData) => {
    try {
      await createLicense(data, token!);
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      bottomSheetRef.current?.dismiss();
      reset();
    } catch (error) {
      console.error('Error adding license:', error);
    }
  };

  return (
    <View className="mb-4 rounded-xl bg-white p-4 shadow-default">
      <View className="mb-4 flex-row justify-between">
        <Text className="font-semibold">Licenses</Text>
        <Text className="font-semibold">Expires</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : licenses && licenses.length > 0 ? (
        licenses.map((license) => (
          <View key={license.id} className="flex-row justify-between border-b border-gray-300 py-2">
            <Text className="text-gray-800">{license.name}</Text>
            <Text className="text-gray-800">
              {license.expires_at ? format(new Date(license.expires_at), 'dd/MM/yyyy') : 'N/A'}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-center text-gray-500">No licenses found.</Text>
      )}

      <TouchableOpacity
        className="mt-4 flex-row items-center justify-center rounded-full border border-green-500 bg-green-500 py-2"
        onPress={() => bottomSheetRef.current?.present()}>
        <Text className="mr-2 text-lg text-white">+</Text>
        <Text className="text-lg text-white">Add License</Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan">
        <View className="flex-1 rounded-t-[15px]">
          <Text className="mb-4 w-full border-b border-black/10 text-center text-lg font-semibold">
            Add License
          </Text>
          <BottomSheetScrollView className="flex-1 px-4">
            <Controller
              control={control}
              name="licenseName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-base">License Name</Text>
                  <TextInput
                    className="rounded-md border bg-white p-3 text-lg"
                    placeholder="Enter license name"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.licenseName && (
                    <Text className="text-red-500">{errors.licenseName.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="expiresAt"
              render={({ field: { value } }) => (
                <View className="mb-4 flex-1">
                  <Text className="text-base">Expiration Date</Text>
                  <View className="items-center justify-center">
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display={'spinner'}
                      themeVariant="light"
                      onChange={(event, date) => {
                        if (date) setValue('expiresAt', date);
                      }}
                    />
                  </View>
                  {errors.expiresAt && (
                    <Text className="text-red-500">{errors.expiresAt.message}</Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-2xl bg-[#2ED013] p-4"
              onPress={handleSubmit(handleAddLicense)}>
              <Feather name="plus-circle" size={24} color="white" />
              <Text className="ml-2 text-base font-semibold text-white">Create License</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </View>
  );
}
