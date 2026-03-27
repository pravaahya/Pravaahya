import { Product } from "@/types/product";

export const mockProductsDB: Product[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: `Sustainable Item ${i + 1}`,
  description: `Eco-friendly ${["decor", "apparel", "gift", "accessory"][i % 4]} built to last without harming the planet. Ideal for sustainable lifestyles.`,
  price: Math.round((10 + ((i * 7) % 150)) * 100) / 100,
  stock: Math.floor(Math.random() * 45) + 5,
  category: ["Home", "Lifestyle", "Gifts", "Apparel"][i % 4],
  tags: ["eco", "organic", "recycled", "sustainable", "handcrafted"].slice(i % 5, (i % 5) + (i % 3) + 1),
  images: ["/placeholder1.svg", "/placeholder2.svg", "/placeholder3.svg"]
}));
