import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { LineChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { fetchTotalTimeData, TimeDataItem, TimeSeriesData } from '~/api/time-series';
import { useAuth } from '~/context/auth-context';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// Default data for testing/fallback
const defaultTimeSeriesData: TimeSeriesData = {
  data: [
    { date: '31/03/24', value: 0 },
    { date: '30/06/24', value: 0 },
    { date: '30/09/24', value: 0 },
    { date: '31/12/24', value: 0 },
  ],
  success: true
};

export default function TotalTimeChartScreen() {
  const { token } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const options: ('1yr' | '3yr' | '5yr' | 'start')[] = ['1yr', '3yr', '5yr', 'start'];
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData>(defaultTimeSeriesData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo(null);
      
      console.log('Fetching time series data with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetchTotalTimeData(undefined, token || undefined);
      
      if (!response.success || !Array.isArray(response.data)) {
        if (retryCount < 2) {
          console.log(`Invalid data received, retrying (${retryCount + 1}/2)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(loadData, 1000);
          return;
        }
        throw new Error('Invalid data received from server');
      }
      
      setTimeSeriesData(response);
    } catch (err: any) {
      console.error('Error fetching time series data:', err);
      setError('Failed to load flight time data. Please try again later.');
      setDebugInfo(err?.message || 'Unknown error');
      setTimeSeriesData(defaultTimeSeriesData);
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

  const selectedPeriod = options[selectedIndex];
  const data = timeSeriesData.data || [];

  // Filter data based on selected period
  const filteredData = React.useMemo(() => {
    if (!data.length) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case '1yr':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case '3yr':
        startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        break;
      case '5yr':
        startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        break;
      case 'start':
      default:
        return data; // Return all data for 'start'
    }
    
    return data.filter(item => {
      const [day, month, year] = item.date.split('/');
      const itemDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
      return itemDate >= startDate;
    });
  }, [selectedPeriod, data]);

  const areaChartData = filteredData.map((item) => ({
    value: item.value,
    label: item.date,
  }));

  // Format the display labels for the segmented control
  const displayLabels = options.map(option => {
    if (option === '1yr') return '1 yr';
    if (option === '3yr') return '3 yr';
    if (option === '5yr') return '5 yr';
    return 'Start';
  });

  return (
    <Layout variant='secondary'>
      <Header title="TOTAL TIME" />
      <ScrollView>
        <View className="flex-1 rounded-xl bg-white p-4 shadow-default">
          <SegmentedControl
            values={displayLabels}
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
              <Text className="mt-4 text-gray-600">Loading flight time data...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center" style={{ height: 300 }}>
              <Text className="text-red-500">{error}</Text>
              {debugInfo && (
                <Text className="mt-2 text-xs text-gray-500">Debug info: {debugInfo}</Text>
              )}
              <TouchableOpacity 
                onPress={handleRetry}
                className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : data.length === 0 ? (
            <View className="flex-1 items-center justify-center" style={{ height: 300 }}>
              <Text className="text-gray-600">No flight time data available for this period.</Text>
              <TouchableOpacity 
                onPress={handleRetry}
                className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ height: screenHeight * 0.6 }}>
              <LineChart
                areaChart1
                data={areaChartData}
                color={'#45D62E'}
                startFillColor={'#B2EEAD'}
                endFillColor={'#FFFFFF'}
                yAxisTextStyle={{ fontSize: 10, color: 'black' }}
                xAxisLabelTextStyle={{ fontSize: 10, color: 'black', transform: [{ rotate: '90deg' }] }} // Rotate for better fit
                hideYAxisText={false}
                xAxisThickness={0}
                yAxisThickness={0}
                hideRules
                hideDataPoints1
                curved
                initialSpacing={40}
                spacing={80}
                width={screenWidth - 40} // Adjust for padding
                height={screenHeight * 0.5}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}
