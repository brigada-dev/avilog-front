import { GradientBackground } from '~/components/ui/GradientBackground';
import { Container } from '~/components/Container';
import { ScrollView } from 'react-native';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GradientBackground>
      <ScrollView>
        <Container>{children}</Container>
      </ScrollView>
    </GradientBackground>
  );
}
