import { Product } from "@/types/product";

const mockProducts: Product[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: `Sustainable Product ${i + 1}`,
  description: "Eco-friendly, sourced locally and built to last without harming the planet.",
  price: 29.99 + (i * 2),
  category: "Home",
  stock: 100,
  tags: ["eco-friendly"],
  images: [] // Assuming SVG fallback is handled by the UI
}));

export async function fetchProducts(page: number, limit: number = 5): Promise<{ data: Product[], hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = mockProducts.slice(start, end);
      resolve({
        data: paginatedData,
        hasMore: end < mockProducts.length
      });
    }, 600); // 600ms artificial network latency for UX testing
  });
}
