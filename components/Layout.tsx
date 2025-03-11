import { GradientBackground } from '~/components/ui/GradientBackground';
import { Container } from '~/components/Container';
import { ScrollView, View } from 'react-native';

export default function Layout({ 
  children, 
  variant, 
  disableScroll = false 
}: { 
  children: React.ReactNode; 
  variant: 'primary' | 'secondary' | 'tertiary'; 
  disableScroll?: boolean;
}) {
  return (
    <GradientBackground variant={variant}>
      {disableScroll ? (
        <Container>{children}</Container>
      ) : (
        <ScrollView>
          <Container>{children}</Container>
        </ScrollView>
      )}
    </GradientBackground>
  );
}
