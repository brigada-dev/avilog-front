import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { BarChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { fetchCrewStats, CrewStatsData } from '~/api/crew-stats';
import { useAuth } from '~/context/auth-context';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// Default data for testing/fallback
const defaultCrewData: CrewStatsData = {
  '`25': [],
  '1 yr': [],
  '3 yr': [],
  'start': []
};

export default function CrewRoute() {
  const { token } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [crewData, setCrewData] = useState<CrewStatsData>(defaultCrewData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching crew stats with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetchCrewStats(token || undefined);
      
      if (!response.success || !response.data) {
        if (retryCount < 2) {
          console.log(`Invalid data received, retrying (${retryCount + 1}/2)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(loadData, 1000);
          return;
        }
        throw new Error('Invalid data received from server');
      }
      
      setCrewData(response.data);
    } catch (err: any) {
      console.error('Error fetching crew stats:', err);
      setError('Failed to load crew statistics. Please try again later.');
      setCrewData(defaultCrewData);
    } finally {
      setIsLoading(false);
    }
  }, [token, retryCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRetry = () => {
    setRetryCount(0);
    loadData();
  };

  const options: ('`25' | '1 yr' | '3 yr' | 'start')[] = ['`25', '1 yr', '3 yr', 'start'];
  const selectedLabel = options[selectedIndex];
  const data = crewData[selectedLabel] || [];

  // Determine max value dynamically and add padding
  const maxValue = Math.max(...Object.values(crewData).flat().map(item => item.hours), 0);
  const chartMaxValue = Math.ceil(maxValue * 1.2);

  // Convert dataset to the format required by `react-native-gifted-charts`
  const barChartData = data.map((item) => ({
    value: item.hours,
    label: item.name,
    frontColor: '#45D62E',
  }));

  return (
    <Layout variant='secondary'>
      <Header title="CREW" />
      <View className="flex-1 rounded-xl bg-white p-4 shadow-default">
        <SegmentedControl
          values={options}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
          fontStyle={{ fontWeight: '600', color: 'black' }}
          activeFontStyle={{ color: 'black' }}
          tabStyle={{ backgroundColor: '#45D62E', borderColor: '#2B9C1A', opacity: 1 }}
          style={{ marginBottom: 15, backgroundColor: '#B2EEAD', borderRadius: 8, opacity: 1 }}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center" style={{ height: 300 }}>
            <ActivityIndicator size="large" color="#45D62E" />
            <Text className="mt-4 text-gray-600">Loading crew statistics...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center" style={{ height: 300 }}>
            <Text className="text-red-500">{error}</Text>
            <Text 
              className="mt-4 text-blue-500 underline"
              onPress={handleRetry}
            >
              Retry
            </Text>
          </View>
        ) : data.length === 0 ? (
          <View className="flex-1 items-center justify-center" style={{ height: 300 }}>
            <Text className="text-gray-600">No crew data available for this period.</Text>
            <Text 
              className="mt-4 text-blue-500 underline"
              onPress={handleRetry}
            >
              Retry
            </Text>
          </View>
        ) : (
          <View style={{ height: screenHeight * 0.8, width: screenWidth }}>
            <BarChart
              disableScroll
              data={barChartData}
              barBorderRadius={5}
              showGradient
              frontColor={'#39D52B'}
              gradientColor={'#A1EA95'}
              horizontal
              xAxisThickness={0}
              yAxisThickness={0}
              xAxisLabelsHeight={20}
              labelsDistanceFromXaxis={20}
              yAxisTextStyle={{ fontSize: 8, color: 'black' }}
              showValuesAsTopLabel={false}
              maxValue={chartMaxValue}
              noOfSections={5}
            />
          </View>
        )}
      </View>
    </Layout>
  );
}
