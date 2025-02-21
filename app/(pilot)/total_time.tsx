import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { LineChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

interface TimeDataItem {
  date: string;
  value: number;
}

type TimeSeriesData = {
  [key in '1 yr' | '3 yr' | '5 yr' | 'Start']: TimeDataItem[];
};

// Sample Data (You can modify this with real values)
const timeSeriesData: TimeSeriesData = {
  '1 yr': [
    { date: '31/03/24', value: 2500 },
    { date: '31/06/24', value: 2600 },
    { date: '31/09/24', value: 2750 },
    { date: '31/12/24', value: 2800 },
  ],
  '3 yr': [
    { date: '31/03/22', value: 2000 },
    { date: '31/06/22', value: 2200 },
    { date: '31/09/22', value: 2400 },
    { date: '31/12/22', value: 2600 },
  ],
  '5 yr': [
    { date: '31/03/20', value: 1500 },
    { date: '31/06/20', value: 1800 },
    { date: '31/09/20', value: 2100 },
    { date: '31/12/20', value: 2300 },
  ],
  Start: [
    { date: '31/03/18', value: 1000 },
    { date: '31/06/18', value: 1300 },
    { date: '31/09/18', value: 1700 },
    { date: '31/12/18', value: 2000 },
  ],
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function TotalTimeChartScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const options: ('1 yr' | '3 yr' | '5 yr' | 'Start')[] = ['1 yr', '3 yr', '5 yr', 'Start'];

  const selectedPeriod = options[selectedIndex];
  const data: TimeDataItem[] = timeSeriesData[selectedPeriod];

  const areaChartData = data.map((item) => ({
    value: item.value,
    label: item.date,
  }));

  return (
    <Layout>
      <Header title="TOTAL TIME" />
      <View className="flex-1 rounded-xl bg-white p-4 shadow-md">
        <SegmentedControl
          values={options}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
          fontStyle={{ fontWeight: '600', color: 'black' }}
          activeFontStyle={{ color: 'black' }}
          tabStyle={{ backgroundColor: '#45D62E', borderColor: '#2B9C1A', opacity: 1 }}
          style={{ marginBottom: 15, backgroundColor: '#B2EEAD', borderRadius: 8, opacity: 1 }}
        />

        <View style={{ flex:1 }}>
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
            width={screenWidth}
            height={screenHeight * 0.6}
          />
        </View>
      </View>
    </Layout>
  );
}
