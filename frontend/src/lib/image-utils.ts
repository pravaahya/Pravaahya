import { API_URL } from "@/lib/api";

export const resolveImage = (url: string | undefined | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("data:")) return url;
  
  const baseApi = API_URL || "http://localhost:5000/api";
  const BASE_URL = baseApi.replace('/api', '');
  
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
