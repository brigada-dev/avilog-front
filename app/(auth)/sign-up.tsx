import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/auth-context';
import * as z from 'zod';

const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string().min(6, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp } = useAuth();

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="mb-4 text-3xl font-bold text-black">Sign Up</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3 placeholder:text-black/20"
            placeholder="Name"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="name-given"
            autoCorrect={false}
          />
        )}
      />
      {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
      <Controller
        control={control}
        name="surname"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3 placeholder:text-black/20"
            placeholder="Surname"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="name-family"
            autoCorrect={false}
          />
        )}
      />
      {errors.surname && <Text className="text-red-500">{errors.surname.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3 placeholder:text-black/20"
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType='email-address'
          />
        )}
      />
      {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3 placeholder:text-black/20"
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="new-password"
            autoCorrect={false}
          />
        )}
      />
      {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-2 w-full rounded-lg border p-3 placeholder:text-black/20"
            placeholder="Confirm Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="new-password"
            autoCorrect={false}
          />
        )}
      />
      {errors.password_confirmation && (
        <Text className="text-red-500">{errors.password_confirmation.message}</Text>
      )}
      <TouchableOpacity
        className="mt-2 w-full rounded-lg bg-green-600 p-3"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-center text-lg text-white">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
