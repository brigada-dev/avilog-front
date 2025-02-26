import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { signInUser, signUpUser } from "../api/auth";
import { SignUpFormData } from "~/app/(auth)/sign-up";
import { SignInFormData } from "~/app/(auth)/sign-in";
import { Alert } from "react-native";

type AuthContextType = {
  user: any | null;
  token: string | null;
  signIn: (data: SignInFormData) => void;
  signUp: (data: SignUpFormData) => void;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await SecureStore.getItemAsync("avilog_auth_session");

      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          setToken(parsedSession.token);
          setUser(parsedSession.user);
        } catch (error) {
          console.error("Failed to parse stored session:", error);
        }
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const storeSession = async (session: { token: string; user: any }) => {
    if (!session.token || !session.user) {
      console.error("Invalid session data:", session);
      return;
    }

    await SecureStore.setItemAsync("avilog_auth_session", JSON.stringify(session));
    setToken(session.token);
    setUser(session.user);
  };

  const clearSession = async () => {
    await SecureStore.deleteItemAsync("avilog_auth_session");
    setToken(null);
    setUser(null);
    router.replace("/sign-in");
  };

  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormData) => signInUser(data),
    onSuccess: async (response) => {
      const user = response?.data?.user;
      const token = response?.data?.access_token;
      if (!user || !token) {
        console.error("Invalid response received:", response);
        return;
      }
      await storeSession({ token, user });
      router.replace("/(pilot)");
    },
    onError: (error) => console.error("Login failed:", error),
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => signUpUser(data),
    onSuccess: async (response) => {
      const user = response?.data?.user;

      if (!user) {
        console.error("Invalid response received:", response);
        return;
      }

      Alert.alert(
        "Registration Successful",
        "Please check your email to verify your account before logging in."
      );

      router.replace("/sign-in");
    },
    onError: (error) => console.error("Sign-up failed:", error),
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn: signInMutation.mutate,
        signUp: signUpMutation.mutate,
        signOut: clearSession,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
