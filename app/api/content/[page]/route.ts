import { NextResponse } from "next/server";
import { isSiteContentPage } from "@/data/siteContent";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!isSiteContentPage(page)) {
    return NextResponse.json(
      { error: "Página de contenido no válida." },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }
  const content = await getSiteContent(page);
  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}
