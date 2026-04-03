/**
 * Centralized API configuration and fetch wrapper
 */

export const getBaseUrl = (): string => {
  let base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocalNetwork = (h: string) => {
        return h === "localhost" || h === "127.0.0.1" || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("172.");
      };

      if (isLocalNetwork(hostname)) {
        base = `http://${hostname}:5000/api`;
      } else {
        base = "https://pravaahya.com/api";
      }
    } else {
      // Server-side
      base = process.env.NODE_ENV === "production" ? "https://pravaahya.com/api" : "http://localhost:5000/api";
    }

    if (process.env.NODE_ENV === "production" && base === "https://pravaahya.com/api") {
      console.error("CRITICAL ERROR: 'NEXT_PUBLIC_API_URL' environment variable is missing in production. Falling back to default URL.");
    }
  }

  // Ensure no trailing slash
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export const API_URL = getBaseUrl();

/**
 * Returns the fully qualified URL for an API endpoint.
 */
export const getApiUrl = (endpoint: string) => {
  const base = API_URL;
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
