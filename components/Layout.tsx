import { GradientBackground } from '~/components/ui/GradientBackground';
import { Container } from '~/components/Container';
import { ScrollView } from 'react-native';

export default function Layout({ children, variant }: { children: React.ReactNode; variant: 'primary' | 'secondary' | 'tertiary'; }) {
  return (
    <GradientBackground variant={variant}>
      <ScrollView>
        <Container>{children}</Container>
      </ScrollView>
    </GradientBackground>
  );
}
