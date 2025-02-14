import { Stack } from 'expo-router';
import React from 'react';

import ProfileScreen from '../screens/ProfileScreen';

export default function ProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <ProfileScreen />
    </>
  );
}
