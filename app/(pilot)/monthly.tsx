import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { BarChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { fetchMonthlyStats, MonthlyDataItem, YearlyData } from '~/api/monthly-stats';
import { useAuth } from '~/context/auth-context';

const screenHeight = Dimensions.get('window').height;

// Default data for testing/fallback
const defaultMonthlyData: YearlyData = {
  '2024': Array(12).fill(0).map((_, index) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
    value: 0
  }))
};

export default function MonthlyChartScreen() {
  const { token } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<YearlyData>(defaultMonthlyData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching monthly stats with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetchMonthlyStats(token || undefined);
      
      if (!response.success || !response.data) {
        if (retryCount < 2) {
          console.log(`Invalid data received, retrying (${retryCount + 1}/2)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(loadData, 1000);
          return;
        }
        throw new Error('Invalid data received from server');
      }
      
      setMonthlyData(response.data);
    } catch (err: any) {
      console.error('Error fetching monthly stats:', err);
      setError('Failed to load monthly statistics. Please try again later.');
      setMonthlyData(defaultMonthlyData);
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

  // Get available years and sort them
  const years = Object.keys(monthlyData).sort();
  const options = years.length > 0 ? years : ['2024'];
  
  const selectedYear = options[selectedIndex];
  const data: MonthlyDataItem[] = monthlyData[selectedYear] || defaultMonthlyData['2024'];

  const barChartData = data.map((item) => ({
    value: item.value,
    label: item.month,
    frontColor: '#45D62E',
  }));

  // Find max value dynamically for consistent scaling
  const allValues = Object.values(monthlyData).flatMap((yearData) =>
    yearData.map((item) => item.value)
  );
  const maxValue = allValues.length > 0 ? Math.ceil(Math.max(...allValues) * 1.2) : 100;

  return (
    <Layout variant='secondary'>
      <Header title="MONTHLY" />
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
            <Text className="mt-4 text-gray-600">Loading monthly statistics...</Text>
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
        ) : (
          <View style={{ flex: 1 }}>
            <BarChart
              data={barChartData}
              barWidth={15}
              spacing={10}
              barBorderRadius={3}
              showGradient
              xAxisThickness={0}
              yAxisThickness={0}
              frontColor={'#39D52B'}
              gradientColor={'#A1EA95'}
              yAxisTextStyle={{ fontSize: 10, color: 'black' }}
              xAxisLabelsVerticalShift={5}
              xAxisLabelTextStyle={{ fontSize: 10, color: 'black', transform: [{ rotate: '90deg' }] }}
              noOfSections={20}
              maxValue={maxValue}
              height={screenHeight * 0.8}
            />
          </View>
        )}
      </View>
    </Layout>
  );
}
