import { NextResponse } from "next/server";
import { Product } from "@/types/product";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  let product: Product | null = null;
  let related: Product[] = [];
  try {
     const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pravaahya.com/api"}/products/${id}`, { cache: 'no-store' });
     const backendJson = await backendRes.json();
     if (backendJson.success && backendJson.data) {
        const p = backendJson.data;
        product = {
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category,
            tags: p.tags,
            images: p.images
        };

        const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pravaahya.com/api"}/products`, { cache: 'no-store' });
        const relatedJson = await relatedRes.json();
        if (relatedJson.success && Array.isArray(relatedJson.data)) {
            related = relatedJson.data
                .filter((r: any) => r.category === product!.category && r._id !== product!.id)
                .slice(0, 4)
                .map((r: any) => ({
                    id: r._id,
                    name: r.name,
                    description: r.description,
                    price: r.price,
                    stock: r.stock,
                    category: r.category,
                    tags: r.tags,
                    images: r.images
                }));
        }
     }
  } catch(e) { console.error("Database Link Failure:", e); }
  
  if (!product) {
    return NextResponse.json({ error: "Product not found remotely mapped." }, { status: 404 });
  }

  return NextResponse.json({ product, related });
}
