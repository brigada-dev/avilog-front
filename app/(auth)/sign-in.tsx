import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/auth-context';
import * as z from 'zod';
import { router } from 'expo-router';

const signInSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { signIn } = useAuth();

  const onSubmit = (data: SignInFormData) => {
    signIn(data);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="mb-4 text-3xl font-bold text-black">Sign In</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3"
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3"
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

      <TouchableOpacity
        className="mt-2 w-full rounded-lg bg-blue-600 p-3"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-center text-lg text-white">Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 flex-row items-center justify-center gap-1"
        onPress={() => router.push('/sign-up')}>
        <Text>Don't have an account?</Text>
        <Text className="text-green-600">Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 flex-row items-center justify-center gap-1"
        onPress={() => router.push('/sign-up')}>
        <Text>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}
