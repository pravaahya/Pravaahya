/**
 * Centralized API configuration and fetch wrapper
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== "undefined") {
  console.error("CRITICAL ERROR: 'NEXT_PUBLIC_API_URL' environment variable is missing in production. API requests are expected to critically fail.");
}

/**
 * Returns the fully qualified URL for an API endpoint.
 * Defaults to localhost:5000/api in local dev environments if unconfigured.
 */
export const getApiUrl = (endpoint: string) => {
  const base = API_URL || 'http://localhost:5000/api';
  return `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

/**
 * Centralized wrapper over native fetch providing logging, URL derivation, and structured defaults.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.warn(`[Pravaahya Network] API Error [${response.status}] fetching ${endpoint}`);
    }
    
    return response;
  } catch (error) {
    console.error(`[Pravaahya Network] Network or CORS fetch failure at ${endpoint}:`, error);
    throw error;
  }
}
