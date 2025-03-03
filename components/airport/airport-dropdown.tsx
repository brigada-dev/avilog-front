import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserSettings } from '~/context/user-context';
import { useAuth } from '~/context/auth-context';
import { FlashList } from '@shopify/flash-list';
import { fetchAirports } from '~/api/airports';

type AirportDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export default function AirportDropdown({ value, onChange }: AirportDropdownProps) {
  const { standard_style } = useUserSettings();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: fetchedAirports,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['airports', searchTerm, standard_style, token!],
    queryFn: fetchAirports,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
  });

  const allAirports =
    fetchedAirports?.pages?.flatMap((page) =>
      (page.airports || []).map((airport: any) => ({
        label: `${airport.name || 'Unknown Airport'} (${airport.icao || airport.iata || 'N/A'})`,
        value: airport.id ?? 'N/A',
      }))
    ) || [];

  const filteredAirports = searchTerm
    ? allAirports.filter((airport) =>
        airport.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allAirports;

  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
        }}
        onPress={() => setModalVisible(true)}>
        <Text>
          {value
            ? allAirports.find((a) => a.value === value)?.label || 'Select an Airport'
            : 'Select an Airport'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, color: 'blue' }}>Close</Text>
            </TouchableOpacity>

            <FlashList
              data={filteredAirports}
              keyExtractor={(item) => String(item.value)}
              estimatedItemSize={50}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ccc' }}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}>
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                isFetchingNextPage ? <ActivityIndicator size="small" color="blue" /> : null
              }
            />

            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                paddingHorizontal: 12,
                fontSize: 16,
                backgroundColor: 'white',
                marginTop: 10,
              }}
              placeholder="Search Airport..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
