import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { RecentlyViewedCarousel } from "@/components/home/RecentlyViewedCarousel";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <HeroSlider />
      <ProductCarousel title="Featured Eco-Products" />
      <RecentlyViewedCarousel />
    </div>
  );
}
