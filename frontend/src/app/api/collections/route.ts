import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pravaahya.com/api"}/collections`, { cache: 'no-store' });
    const backendJson = await backendRes.json();
    return NextResponse.json(backendJson);
  } catch(e) {
    console.error("Database Link Failure:", e);
    return NextResponse.json({ success: false, data: [] });
  }
}
