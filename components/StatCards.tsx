import { View, Text, Image, ImageSourcePropType, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { useAuth } from '~/context/auth-context';

type StatCardProps = {
  id: number;
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

interface StatsResponse {
  data: {
    total_time: string;
    total_flights: number;
    pic_time: string;
    landings: number;
  };
  success: boolean;
}

const fetchStats = async (token: string) => {
  const response = await api('/stat-cards', token) as StatsResponse;
  if (!response.success) {
    throw new Error('Failed to fetch stats');
  }
  return response.data;
};

const renderStatCard = ({ item }: { item: StatCardProps }) => {
  return (
    <View className="flex-1 flex-row items-center gap-6 rounded-xl bg-white p-4">
      <View className="flex-row items-center">
        <Image source={item.icon} className="mr-2 h-6 w-6" />
        <Text className="ml-1 text-lg font-semibold">{item.label}</Text>
      </View>
      <Text className="ml-auto text-lg">{item.value}</Text>
    </View>
  );
};

export function StatCards() {
  const { token } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stat-cards', token],
    queryFn: () => fetchStats(token!),
    enabled: !!token
  });

  if (isLoading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        horizontal
        contentContainerStyle={{ gap: 16, paddingBottom: 20, marginTop: 16 }}
        renderItem={() => (
          <View className="flex-1 flex-row items-center gap-6 rounded-xl bg-white p-4 opacity-50">
            <View className="h-6 w-24 bg-gray-200 rounded" />
            <View className="h-6 w-16 bg-gray-200 rounded ml-auto" />
          </View>
        )}
        keyExtractor={(item) => item.toString()}
      />
    );
  }

  const statCards: StatCardProps[] = [
    {
      id: 1,
      icon: require('../assets/images/klok.png'),
      label: 'Total time',
      value: stats?.total_time || '0:00 H',
    },
    {
      id: 2,
      icon: require('../assets/images/pilot_hat.png'),
      label: 'Total flights',
      value: stats?.total_flights?.toString() || '0',
    },
    {
      id: 3,
      icon: require('../assets/images/klok.png'),
      label: 'PIC',
      value: stats?.pic_time || '0:00 H',
    },
    {
      id: 4,
      icon: require('../assets/images/pilot_hat.png'),
      label: 'Landings',
      value: stats?.landings?.toString() || '0',
    },
  ];

  return (
    <FlatList
      renderItem={renderStatCard}
      data={statCards}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      contentContainerStyle={{ gap: 16, paddingBottom: 20, marginTop: 16 }}
    />
  );
}
