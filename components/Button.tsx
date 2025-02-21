import { Image } from 'expo-image';
import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title?: string;
  iconLeft?: any; // New prop for left icon
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, iconLeft, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>
        {iconLeft && <Image source={iconLeft} style={{ width: 24, height: 24, marginRight: 8 }} />}
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 8, // Spacing between icon and text
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
