import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';

type AirportData = {
  code: string;
  country: string;
  visits: number;
  flagUrl: string;
};

type AirportChartProps = {
  data: AirportData[];
};
export function AirportChart({ data }: AirportChartProps) {
  const maxVisits = Math.max(...data.map((item) => item.visits));

  const screenWidth = Dimensions.get('window').width;
  const flagCodeWidth = 80;
  const barMaxWidth = screenWidth - flagCodeWidth - 120;

  const renderItem = ({ item }: { item: AirportData }) => (
    <View
      key={item.code}
      className="flex-row items-center"
      accessibilityRole="progressbar"
      accessibilityLabel={`${item.code} with ${item.visits} visits`}
      style={{ marginBottom: 8 }}>
      <View
        style={{
          width: flagCodeWidth,
          flexDirection: 'row',
          alignItems: 'center',
          // borderRightWidth: 1,
          // borderColor: '#C4C4C4',
        }}>
        <Image
          source={{ uri: item.flagUrl }}
          style={{ width: 24, height: 16, marginRight: 8 }}
          resizeMode="cover"
          accessibilityLabel={`Flag of ${item.country}`}
        />
        <Text style={{ fontWeight: '500', color: '#333' }}>{item.code}</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            height: 20,
            width: (item.visits / maxVisits) * barMaxWidth,
            backgroundColor: '#23d013',
            borderRadius: 4,
          }}
        />
        <Text style={{ marginLeft: 8, color: '#333' }}>{item.visits}</Text>
      </View>
    </View>
  );

  return (
    <View className="rounded-xl bg-white p-4">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        scrollEnabled={false}
      />
    </View>
  );
}
