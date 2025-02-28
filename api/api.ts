export const api = async (endpoint: string, token?: string, options: RequestInit = {}) => {
  console.log(endpoint, token, options)
  const response = await fetch(`${process.env.EXPO_PUBLIC_LARAVEL_API}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
