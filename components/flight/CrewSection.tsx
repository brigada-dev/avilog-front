import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

type CrewSectionProps = {
  onAddCrew: () => void;
  onChangeRole: () => void;
};

export function CrewSection({ onAddCrew, onChangeRole }: CrewSectionProps) {
  return (
    <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
      <TouchableOpacity
        className="mb-4 flex-row items-center justify-between"
        onPress={onChangeRole}>
        <View className="flex-row items-center">
          <View className="rounded-full bg-[#23d013] px-3 py-1">
            <Text className="text-white">SIC</Text>
          </View>
          <Text className="ml-4">Self</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#23d013" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center justify-center border-t border-gray-200 py-3"
        onPress={onAddCrew}>
        <Feather name="edit-2" size={20} color="#23d013" />
        <Text className="ml-2 text-[#23d013]">Add Crew</Text>
      </TouchableOpacity>
    </View>
  );
}
