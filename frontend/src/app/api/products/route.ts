import { NextResponse } from "next/server";
import { Product } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Simulated server latency to evaluate UX loading states
  await new Promise(resolve => setTimeout(resolve, 500));

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy") || "id";
  const sortDir = searchParams.get("sortDir") || "asc";
  const collectionId = searchParams.get("collectionId");

  let filtered: Product[] = [];
  try {
    if (collectionId) {
       // Fetch explicitly from the matched Collection hash
       const colRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pravaahya.com/api"}/collections/${collectionId}`, { cache: 'no-store' });
       const colJson = await colRes.json();
       if (colJson.success && colJson.data && Array.isArray(colJson.data.products)) {
           filtered = colJson.data.products.map((p: any) => ({
               id: p._id, name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, tags: p.tags, images: p.images
           }));
       }
    } else {
       // Global Catalog Fetch
       const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pravaahya.com/api"}/products`, { cache: 'no-store' });
       const backendJson = await backendRes.json();
       if (backendJson.success && Array.isArray(backendJson.data)) {
           filtered = backendJson.data.map((p: any) => ({
               id: p._id, name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, tags: p.tags, images: p.images
           }));
       }
    }
  } catch(e) { console.error("Database Link Failure:", e); }

  // Category Exact Match
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Soft text searching
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.description.toLowerCase().includes(search) ||
      p.tags.some(t => t.toLowerCase().includes(search))
    );
  }

  // Price Boundary Checking
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sort Routine
  filtered.sort((a, b) => {
    let aVal: any = a[sortBy as keyof Product];
    let bVal: any = b[sortBy as keyof Product];
    
    // Fallbacks
    if (aVal === undefined) aVal = a.id;
    if (bVal === undefined) bVal = b.id;

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    metadata: {
      total,
      page,
      limit,
      totalPages
    }
  });
}
