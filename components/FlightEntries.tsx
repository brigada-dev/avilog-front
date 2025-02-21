import { View, Text, Image, FlatList } from 'react-native';

type FlightEntriesProps = {
  id: number;
  registration: string;
  type: string;
  date: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
  depFlag: any;
  arrFlag: any;
};

const recentFlights: FlightEntriesProps[] = [
  {
    id: 1,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: require('../assets/images/latvia.png'),
    arrFlag: require('../assets/images/sweden.png'),
  },
  {
    id: 2,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: require('../assets/images/romania.png'),
    arrFlag: require('../assets/images/latvia.png'),
  },
  {
    id: 3,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: require('../assets/images/latvia.png'),
    arrFlag: require('../assets/images/romania.png'),
  },
  {
    id: 4,
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
    depFlag: require('../assets/images/sweden.png'),
    arrFlag: require('../assets/images/latvia.png'),
  },
];
const renderFlightCard = ({ item }: { item: FlightEntriesProps }) => {
  return (
    <View className="flex-1 flex-row items-center justify-between">
      <View className="w-full flex-1 flex-col items-center p-2">
        <View className="flex flex-row items-center justify-between gap-3">
          <Image source={require('../assets/plane-icon.png')} className="mr-2 h-6 w-6" />
          <Text className="text-base font-medium">{item.registration}</Text>
        </View>
        <View className="flex flex-row items-center justify-between gap-2">
          <Image source={item.depFlag} className="mr-2 h-7 w-10" />
          <View className="flex items-center justify-center rounded-md border border-black px-2">
            <Text className="text-xs font-normal">{item.depTime}</Text>
            <Text className="text-sm font-bold text-black">{item.from}</Text>
          </View>
        </View>
      </View>

      <View className="flex-col items-center">
        <Text className="mx-2 text-xl font-medium">{item.type}</Text>
        <Text className="mx-2 text-3xl font-bold">{item.duration}</Text>
      </View>

      <View className="w-full flex-1 flex-col items-center p-2">
        <View className="flex flex-row items-center justify-between gap-3">
          <Text className="text-base font-medium">{item.date}</Text>
          <Image source={require('../assets/images/calendar.png')} className="mr-2 h-6 w-6" />
        </View>
        <View className="flex flex-row items-center justify-between gap-2">
          <View className="flex items-center justify-center rounded-md border border-black px-2">
            <Text className="text-xs font-normal">{item.depTime}</Text>
            <Text className="text-sm font-bold text-black">{item.from}</Text>
          </View>
          <Image source={item.arrFlag} className="h-7 w-10" />
        </View>
      </View>
    </View>
  );
};

export function FlightEntries() {
  return (
    <FlatList
      scrollEnabled={false}
      renderItem={renderFlightCard}
      data={recentFlights}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ flex: 1 }}
      ItemSeparatorComponent={() => (
        <View
          style={{ height: 1, width: 240, marginHorizontal: 'auto', backgroundColor: '#DBDADA' }}
        />
      )}
    />
  );
}
