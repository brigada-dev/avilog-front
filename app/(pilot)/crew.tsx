import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { BarChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

type DataSet = { name: string; hours: number };

const dataSets: Record<'`25' | '1 yr' | '3 yr' | 'start', DataSet[]> = {
  '`25': [
    { name: 'Name 1', hours: 34.17 },
    { name: 'Name 2', hours: 60.75 },
    { name: 'Name 3', hours: 34.17 },
    { name: 'Name 4', hours: 41.92 },
    { name: 'Name 5', hours: 64.5 },
  ],
  '1 yr': [
    { name: 'Name 1', hours: 83.2 },
    { name: 'Name 2', hours: 70.75 },
    { name: 'Name 3', hours: 64.5 },
    { name: 'Name 4', hours: 41.92 },
    { name: 'Name 5', hours: 34.17 },
  ],
  '3 yr': [
    { name: 'Name 1', hours: 20.4 },
    { name: 'Name 2', hours: 19.6 },
    { name: 'Name 3', hours: 16.3 },
    { name: 'Name 4', hours: 15.9 },
    { name: 'Name 5', hours: 12.2 },
  ],
  start: [
    { name: 'Name 1', hours: 40 },
    { name: 'Name 2', hours: 30 },
    { name: 'Name 3', hours: 26 },
    { name: 'Name 4', hours: 24 },
    { name: 'Name 5', hours: 22 },
  ],
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function CrewRoute() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const options: ('`25' | '1 yr' | '3 yr' | 'start')[] = ['`25', '1 yr', '3 yr', 'start'];

  const selectedLabel = options[selectedIndex];
  const data = dataSets[selectedLabel];

  // Determine max value dynamically and add padding
  const allValues = Object.values(dataSets).flat().map(item => item.hours);
  const absoluteMaxValue = allValues.length > 0 ? Math.max(...allValues) : 100; // Default to 100 if no data
  const fixedMaxValue = Math.ceil(absoluteMaxValue * 1.2); // Add 20% padding

  // Convert dataset to the format required by `react-native-gifted-charts`
  const barChartData = data.map((item) => ({
    value: item.hours,
    label: item.name,
    frontColor: '#45D62E', // Bar color
  }));

  return (
    <Layout variant='secondary'>
      <Header title="CREW" />
        <View className="flex-1 rounded-xl bg-white p-4 shadow-default">
          <SegmentedControl
            values={options}
            selectedIndex={selectedIndex}
            onChange={(event) =>
              setSelectedIndex(event.nativeEvent.selectedSegmentIndex as 0 | 1 | 2 | 3)
            }
            fontStyle={{ fontWeight: '600', color: 'black' }}
            activeFontStyle={{ color: 'black' }}
            tabStyle={{ backgroundColor: '#45D62E', borderColor: '#2B9C1A', opacity: 1 }}
            style={{ marginBottom: 15, backgroundColor: '#B2EEAD', borderRadius: 8, opacity: 1 }}
          />

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
              maxValue={fixedMaxValue}
              noOfSections={5}
            />
          </View>
        </View>
    </Layout>
  );
}
