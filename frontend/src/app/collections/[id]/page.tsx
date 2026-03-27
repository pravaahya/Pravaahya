import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <ProductDetailClient id={id} />
    </div>
  );
}
