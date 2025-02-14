import { View, Text, Image, ImageSourcePropType } from 'react-native';

type StatCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="mt-4 flex-row items-center rounded-2xl bg-white p-4 shadow-lg">
      <Image source={icon} className="mr-2 h-6 w-6" />
      <Text className="text-lg font-semibold">{label}</Text>
      <Text className="ml-auto text-lg">{value}</Text>
    </View>
  );
}
