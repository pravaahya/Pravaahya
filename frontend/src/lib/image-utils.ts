export const resolveImage = (url: string | undefined | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("data:")) return url;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_URL.replace('/api', '');
  
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
