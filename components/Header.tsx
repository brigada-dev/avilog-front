import { Text, View } from 'react-native';
import { BackButton } from './ui/BackButton';
import { useRouter } from 'expo-router';

export function Header({ title, noBackButton }: { title: string; noBackButton?: boolean }) {
  const router = useRouter();
  return (
    <View className="mb-4 mt-8 flex flex-row items-center">
      {!noBackButton && (
        <View className="absolute left-0">
          <BackButton onPress={router.back} />
        </View>
      )}
      <View className="flex-1" />
      <Text className="text-center text-4xl font-bold uppercase">{title}</Text>
      <View className="flex-1" />
    </View>
  );
}
