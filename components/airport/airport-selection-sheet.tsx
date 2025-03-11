import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserSettings } from '~/context/user-context';
import { useAuth } from '~/context/auth-context';
import { fetchAirports, Airport } from '~/api/airports';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FieldError } from 'react-hook-form';

type AirportDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
  setArrivalAirport?: (country: string) => void;
  setDepartureAirport?: (country: string) => void;
  errors: FieldError | null;
};

export function AirportSelectionSheet({
  value,
  onChange,
  setArrivalAirport,
  setDepartureAirport,
  errors,
}: AirportDropdownProps) {
  const { standard_style } = useUserSettings();
  const { token } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: fetchedAirports,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['airports', searchTerm, standard_style, token],
    queryFn: ({ pageParam = 1 }) => fetchAirports(pageParam, searchTerm, standard_style, token || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
  });

  const allAirports =
    fetchedAirports?.pages?.flatMap((page) =>
      (page.data || []).map((airport: Airport) => ({
        label: `${airport.name} ${airport.code ? `(${airport.code})` : ''}`,
        value: airport.id ?? 'N/A',
        country: airport.country.toLowerCase() ?? 'default',
      }))
    ) || [];

  const filteredAirports = allAirports.filter(
    (airport) => !searchTerm || airport.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseSheet = () => {
    bottomSheetRef.current?.dismiss();
  };
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <>
      <TouchableOpacity
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: errors ? '#fee2e2' : '#eeeeef',
        }}
        onPress={handleOpenSheet}>
        <Text className="text-base" style={{ color: errors ? '#dc2626' : '' }}>
          {value
            ? allAirports.find((a) => a.value === value)?.label || 'Select an Airport'
            : 'Select an Airport'}
        </Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['80%']}
        index={0}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onDismiss={() => setSearchTerm('')}>
        <TextInput
          className="mx-3 h-12 rounded-lg border border-black/20 px-2 text-base placeholder:text-black/20 bg-red"
          placeholder="Search Airport..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <KeyboardAvoidingView
          style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-1">
            <FlashList
              data={filteredAirports}
              keyExtractor={(item) => String(item.value)}
              estimatedItemSize={80}
              renderItem={({ item }) => {
                const isSelected = value === item.value;
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 16,
                      borderBottomWidth: 0.5,
                      borderColor: '#ccc',
                    }}
                    onPress={() => {
                      onChange(item.value);
                      if (setArrivalAirport) setArrivalAirport(item.country.toLowerCase());
                      if (setDepartureAirport) setDepartureAirport(item.country.toLowerCase());
                      handleCloseSheet();
                    }}>
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={{ uri: `https://flagcdn.com/w40/${item.country}.png` }}
                        style={{ width: 32, height: 24, borderRadius: 6 }}
                      />
                      <Text style={{ fontSize: 16 }}>{item.label}</Text>
                    </View>
                    {isSelected ? <Feather name="check" size={24} color="#23D013" /> : null}
                  </TouchableOpacity>
                );
              }}
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                isFetchingNextPage ? (
                  <ActivityIndicator size="small" color="blue" className="my-2" />
                ) : null
              }
            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    </>
  );
}
