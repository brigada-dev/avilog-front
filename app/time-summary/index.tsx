import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from '~/components/Header';
import Layout from '~/components/Layout';
import { StatCard } from '~/components/time/StatCard';
import { SummaryCard } from '~/components/time/SummaryCard';
import { fetchTimeSummary, TimeSummaryData } from '~/api/time-summary';
import { useAuth } from '~/context/auth-context';
import { useQuery } from '@tanstack/react-query';

export default function TimeSummary() {
  const { token } = useAuth();

  const { data, isLoading, error } = useQuery<TimeSummaryData>({
    queryKey: ['timeSummary'],
    queryFn: () => fetchTimeSummary(token || undefined).then(res => res.data),
    enabled: !!token
  });

  if (!token) {
    return (
      <Layout variant="secondary">
        <Header title={`Time\nsummary`} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Please log in to view time summary</Text>
        </View>
      </Layout>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <Header title={`Time\nsummary`} />
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#45D62E" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-500">Failed to load data</Text>
          </View>
        ) : data ? (
          <ScrollView>
            <StatCard title="Currency" items={data.currency} />
            <StatCard title="Time limits" items={data.timeLimits} />
            <SummaryCard title="Summary" items={data.summary} />
            <SummaryCard title="Types" items={data.types} />
            <SummaryCard
              title="Operational condition time"
              items={data.operationalConditionTime}
            />
            <SummaryCard title="Category" items={data.category} />
            <SummaryCard title="Landings" items={data.landings} />
          </ScrollView>
        ) : null}
      </Layout>
    </>
  );
}
