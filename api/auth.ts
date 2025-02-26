import { SignUpFormData } from '~/app/(auth)/sign-up';
import { api } from './api';
import { SignInFormData } from '~/app/(auth)/sign-in';

export const signInUser = async (data: SignInFormData) => {
  return await api('/login', undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const signUpUser = async (data: SignUpFormData) => {
  return await api('/register', undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
