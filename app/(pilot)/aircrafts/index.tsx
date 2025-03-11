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
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Button } from '~/components/Button';
import { Link, Stack } from 'expo-router';
import { useAircrafts } from '~/hooks/useAircrafts';
import { useAuth } from '~/context/auth-context';
import { useAircraftContext } from '~/context/aircraft-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { AircraftCard } from '~/components/aircraft/AircraftCard';

export default function AircraftsRoute() {
  const { token } = useAuth();
  const { setSelectedAircraft } = useAircraftContext();
  const [searchQuery, setSearchQuery] = React.useState('');
  const inputRef = useRef<TextInput>(null);

  const {
    aircrafts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalCount,
    pages,
  } = useAircrafts(searchQuery);

  // Create a flat list of items with section information for proper rendering
  const flatListData = React.useMemo(() => {
    if (!pages) return [];
    
    return pages.flatMap((page, pageIndex) => 
      (page.data || []).map((aircraft) => ({
        ...aircraft,
        // Add metadata for rendering
        _pageIndex: pageIndex,
        _key: `aircraft-${aircraft.id}`
      }))
    );
  }, [pages]);

  if (!token) {
    return (
      <Layout variant="primary">
        <Header title="Aircraft" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Please log in to view aircraft</Text>
        </View>
      </Layout>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="primary" disableScroll>
        <Header title="Aircraft" />
        <View className="flex-1">
          <View className="px-4 py-2">
            <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                ref={inputRef}
                className="ml-2 flex-1 text-base text-gray-800"
                placeholder="Search aircraft..."
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
              <Text className="mb-2 text-center text-red-500">Failed to load aircraft</Text>
              <Text className="text-center text-sm text-gray-500">Please try again later</Text>
            </View>
          ) : isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
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
                    <Link href={`/aircrafts/${item.id}`} asChild>
                      <Pressable onPress={() => setSelectedAircraft(item)}>
                        {({ pressed }) => (
                          <View
                            className="h-32 rounded-xl bg-white"
                            style={[
                              { marginTop: isFirst ? 16 : 0, marginBottom: isLast ? 16 : 0 },
                              pressed && { opacity: 0.7 },
                            ]}>
                            <AircraftCard
                              registration={item.registration}
                              type={item.type}
                              image_url={item.image_url ?? null}
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
                      {searchQuery ? 'No aircraft found' : 'No aircraft added yet'}
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
                      <ActivityIndicator size="large" color="#4CAF50" />
                      <Text className="mt-2 text-center text-sm text-gray-500">
                        Loading more aircraft...
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
                        <Text>Load More Aircraft</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="py-4">
                      <Text className="text-center text-sm text-gray-500">
                        {flatListData.length > 0 ? 'End of list' : 'No aircraft found'}
                      </Text>
                    </View>
                  )
                }
              />
            </View>
          )}

          <View className="items-center justify-center px-4 py-4">
            <Link href="/(pilot)/aircrafts/add" asChild>
              <Button title="Add aircraft" iconLeft={<Image source={require('../../../assets/images/plane.png')} style={{ width: 20, height: 20 }} />} />
            </Link>
          </View>
        </View>
      </Layout>
    </>
  );
}
