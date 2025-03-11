import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { BarChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

// Define TypeScript interfaces
interface MonthlyDataItem {
  month: string;
  value: number;
}

type YearlyData = {
  [key in '2021' | '2022' | '2023' | '2024']: MonthlyDataItem[];
};

// Define dataset with proper typing
const monthlyData: YearlyData = {
  '2021': [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 25 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 75 },
    { month: 'Jul', value: 90 },
    { month: 'Aug', value: 70 },
    { month: 'Sep', value: 65 },
    { month: 'Oct', value: 30 },
    { month: 'Nov', value: 10 },
    { month: 'Dec', value: 5 },
  ],
  '2022': [
    { month: 'Jan', value: 25 },
    { month: 'Feb', value: 18 },
    { month: 'Mar', value: 28 },
    { month: 'Apr', value: 27 },
    { month: 'May', value: 65 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 85 },
    { month: 'Aug', value: 75 },
    { month: 'Sep', value: 60 },
    { month: 'Oct', value: 40 },
    { month: 'Nov', value: 15 },
    { month: 'Dec', value: 8 },
  ],
  '2023': [
    { month: 'Jan', value: 22 },
    { month: 'Feb', value: 17 },
    { month: 'Mar', value: 33 },
    { month: 'Apr', value: 22 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 70 },
    { month: 'Jul', value: 95 },
    { month: 'Aug', value: 80 },
    { month: 'Sep', value: 68 },
    { month: 'Oct', value: 35 },
    { month: 'Nov', value: 12 },
    { month: 'Dec', value: 6 },
  ],
  '2024': [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 14 },
    { month: 'Mar', value: 32 },
    { month: 'Apr', value: 28 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 78 },
    { month: 'Jul', value: 95 },
    { month: 'Aug', value: 72 },
    { month: 'Sep', value: 66 },
    { month: 'Oct', value: 29 },
    { month: 'Nov', value: 12 },
    { month: 'Dec', value: 5 },
  ],
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function MonthlyChartScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number>(3);
  const options: ('2021' | '2022' | '2023' | '2024')[] = ['2021', '2022', '2023', '2024'];

  const selectedYear = options[selectedIndex]; // Now TypeScript understands this is a valid key
  const data: MonthlyDataItem[] = monthlyData[selectedYear];

  // Find max value dynamically for consistent scaling
  const allValues = Object.values(monthlyData).flatMap((yearData) =>
    yearData.map((item) => item.value)
  );
  const absoluteMaxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
  // const fixedMaxValue = Math.ceil(absoluteMaxValue * 1.2); // Add 20% padding

  const barChartData = data.map((item) => ({
    value: item.value,
    label: item.month,
    frontColor: '#45D62E', // Green bar color
  }));

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
            maxValue={100}
            height={screenHeight * 0.8}
          />
        </View>
      </View>
    </Layout>
  );
}
