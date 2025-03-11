import React, { useState, useRef, useMemo } from 'react';
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
import { useAuth } from '~/context/auth-context';
import { fetchAircrafts, Aircraft } from '~/api/aircrafts';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { Feather } from '@expo/vector-icons';
import { FieldError } from 'react-hook-form';
import { AircraftCard } from './AircraftCard';

type AircraftDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
  errors: FieldError | null;
};

export function AircraftSelectionSheet({
  value,
  onChange,
  errors,
}: AircraftDropdownProps) {
  const { token } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: fetchedAircrafts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['aircrafts', searchTerm, token],
    queryFn: ({ pageParam = 1 }) => fetchAircrafts(pageParam, searchTerm, token || undefined, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // Simplified version to avoid crashes
      if (!lastPage) return undefined;
      
      // Check for pagination metadata in different possible locations
      const currentPage = lastPage.current_page || lastPage.meta?.current_page;
      const lastPageNum = lastPage.last_page || lastPage.meta?.last_page;
      
      if (currentPage && lastPageNum && currentPage < lastPageNum) {
        return currentPage + 1;
      }
      
      // If we have data but no pagination info, check if we received a full page
      if (lastPage.data?.length === 20) {
        return pages.length + 1;
      }
      
      return undefined;
    },
  });

  const allAircrafts = useMemo(() => {
    if (!fetchedAircrafts?.pages) return [];
    
    return fetchedAircrafts.pages.flatMap((page, pageIndex) => 
      (page.data || []).map((aircraft: Aircraft) => ({
        label: `${aircraft.registration} (${aircraft.type})`,
        value: aircraft.id,
        registration: aircraft.registration,
        type: aircraft.type,
        image_url: aircraft.image_url,
        _pageIndex: pageIndex,
        _key: `aircraft-${aircraft.id}`
      }))
    );
  }, [fetchedAircrafts]);

  const filteredAircrafts = allAircrafts.filter(
    (aircraft) => !searchTerm || 
      aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.type.toLowerCase().includes(searchTerm.toLowerCase())
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
            ? allAircrafts.find((a) => a.value === value)?.label || 'Select an Aircraft'
            : 'Select an Aircraft'}
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
          placeholder="Search Aircraft..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <KeyboardAvoidingView
          style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-1">
            <FlashList
              data={filteredAircrafts}
              keyExtractor={(item) => item._key}
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
                      handleCloseSheet();
                    }}>
                    <View className="flex-1">
                      <AircraftCard
                        registration={item.registration}
                        type={item.type}
                        image_url={item.image_url ?? null}
                      />
                    </View>
                    {isSelected ? <Feather name="check" size={24} color="#23D013" /> : null}
                  </TouchableOpacity>
                );
              }}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.1}
              ListFooterComponent={() => 
                isFetchingNextPage ? (
                  <View style={{ padding: 20 }}>
                    <ActivityIndicator size="large" color="blue" />
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading more aircraft...</Text>
                  </View>
                ) : hasNextPage ? (
                  <View style={{ padding: 20 }}>
                    <TouchableOpacity 
                      onPress={() => fetchNextPage()}
                      style={{ 
                        padding: 10, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                    >
                      <Text>Load More</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>
                      {filteredAircrafts.length > 0 ? 'End of list' : 'No aircraft found'}
                    </Text>
                  </View>
                )
              }
            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    </>
  );
}
