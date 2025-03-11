export const api = async (endpoint: string, token?: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_LARAVEL_API}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      try {
        // Try to parse the error as JSON
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `API error: ${response.status}`);
      } catch (e) {
        // If parsing fails, use the raw error text
        throw new Error(`API error (${response.status}): ${errorText || 'Unknown error'}`);
      }
    }

    // Check if the response is empty
    const text = await response.text();
    if (!text) {
      console.error('Empty response from API');
      throw new Error('Empty response from server');
    }

    // Try to parse the response as JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
