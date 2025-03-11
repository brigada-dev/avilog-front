import React, { useRef } from 'react';
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Header } from '~/components/Header';
import { PrimaryCards } from '~/components/PrimaryCards';
import Layout from '~/components/Layout';
import { Stack, Link } from 'expo-router';
import { useFlights } from '~/hooks/useFlights';
import { useAuth } from '~/context/auth-context';
import { useFlightContext } from '~/context/flight-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { FlightCard } from '~/components/flight/FlightCard';

const filterOptions = ['1 yr', '3 yr', 'Start'];

export default function LogbookScreen() {
  const { token } = useAuth();
  const { setSelectedFlight } = useFlightContext();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState(0);
  const inputRef = useRef<TextInput>(null);

  const {
    flights,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalCount,
    pages,
  } = useFlights(searchQuery);

  // Create a flat list of items with section information for proper rendering
  const flatListData = React.useMemo(() => {
    if (!pages) return [];
    
    return pages.flatMap((page, pageIndex) => 
      (page.data || []).map((flight) => ({
        ...flight,
        // Add metadata for rendering
        _pageIndex: pageIndex,
        _key: `flight-${flight.id}`
      }))
    );
  }, [pages]);

  if (!token) {
    return (
      <Layout variant="secondary">
        <Header title="ALL FLIGHTS" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Please log in to view flights</Text>
        </View>
      </Layout>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary" disableScroll>
        <Header title="ALL FLIGHTS" />
        <SegmentedControl
          values={filterOptions}
          selectedIndex={selectedFilter}
          onChange={(event) => setSelectedFilter(event.nativeEvent.selectedSegmentIndex)}
          fontStyle={{ fontWeight: '600', color: 'black' }}
          activeFontStyle={{ color: 'black' }}
          tabStyle={{ backgroundColor: '#45D62E', borderColor: '#2B9C1A', opacity: 1 }}
          style={{ marginBottom: 15, backgroundColor: '#B2EEAD', borderRadius: 8, opacity: 1 }}
        />
        <PrimaryCards />
        
        <View className="px-4 py-2">
          <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-default">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              ref={inputRef}
              className="ml-2 flex-1 text-base text-gray-800"
              placeholder="Search flights..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {error ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="mb-2 text-center text-red-500">Failed to load flights</Text>
            <Text className="text-center text-sm text-gray-500">Please try again later</Text>
          </View>
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2B9C1A" />
          </View>
        ) : (
          <View style={{ flex: 1, height: '100%' }}>
            <FlashList
              data={flatListData}
              keyExtractor={(item) => item._key}
              estimatedItemSize={160}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                const isFirst = index === 0;
                const isLast = index === flatListData.length - 1;

                return (
                  <Link href={`/flights/${item.id}`} asChild>
                    <Pressable onPress={() => setSelectedFlight(item)}>
                      {({ pressed }) => (
                        <View
                          className="rounded-xl bg-white"
                          style={[
                            { marginTop: isFirst ? 16 : 0, marginBottom: isLast ? 16 : 0 },
                            pressed && { opacity: 0.7 },
                          ]}>
                          <FlightCard
                            aircraft_registration={item.aircraft_registration}
                            type_of_flight={item.type_of_flight}
                            departure_date_time={item.departure_date_time}
                            arrival_date_time={item.arrival_date_time}
                            departure_airport_code={item.departure_airport.code}
                            arrival_airport_code={item.arrival_airport.code}
                            departure_country_iso={item.departure_country_iso}
                            arrival_country_iso={item.arrival_country_iso}
                          />
                        </View>
                      )}
                    </Pressable>
                  </Link>
                );
              }}
              ListEmptyComponent={() => (
                <View className="py-8">
                  <Text className="text-center text-gray-500">
                    {searchQuery ? 'No flights found' : 'No flights added yet'}
                  </Text>
                </View>
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => 
                isFetchingNextPage ? (
                  <View className="py-4">
                    <ActivityIndicator size="large" color="#2B9C1A" />
                    <Text className="mt-2 text-center text-sm text-gray-500">
                      Loading more flights...
                    </Text>
                  </View>
                ) : hasNextPage ? (
                  <View className="py-4">
                    <TouchableOpacity 
                      onPress={() => fetchNextPage()}
                      style={{ 
                        padding: 10, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 8,
                        alignItems: 'center',
                        marginHorizontal: 50
                      }}
                    >
                      <Text>Load More Flights</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="py-4">
                    <Text className="text-center text-sm text-gray-500">
                      {flatListData.length > 0 ? 'End of list' : 'No flights found'}
                    </Text>
                  </View>
                )
              }
            />
          </View>
        )}

        <View className="items-center justify-center px-4 py-4">
          <Link href="/(pilot)/flights/add" asChild>
            <TouchableOpacity className="flex-row items-center justify-center rounded-lg bg-[#2B9C1A] px-6 py-3">
              <Image source={require('../../../assets/images/plane.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
              <Text className="text-base font-semibold text-white">Add Flight</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Layout>
    </>
  );
}
