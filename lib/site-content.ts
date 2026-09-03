import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
  getDefaultSiteContent,
  isSiteContentSection,
  mergeSiteContent,
  siteContentPages,
  type AllSiteContent,
  type SiteContentPage,
  type SitePageContent,
} from "@/data/siteContent";

type SiteContentRow = {
  page: string;
  section: string;
  content: unknown;
};

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function rowsToContent(page: SiteContentPage, rows: SiteContentRow[]): SitePageContent {
  const stored: SitePageContent = {};
  for (const row of rows) {
    if (row.page === page && isSiteContentSection(page, row.section)) stored[row.section] = row.content as SitePageContent[string];
  }
  return mergeSiteContent(page, stored);
}

export async function getSiteContent(page: SiteContentPage): Promise<SitePageContent> {
  try {
    const { data, error } = await createPublicClient()
      .from("site_content")
      .select("page,section,content")
      .eq("page", page);
    if (error) return getDefaultSiteContent(page);
    return rowsToContent(page, (data ?? []) as SiteContentRow[]);
  } catch {
    return getDefaultSiteContent(page);
  }
}

export async function getAllSiteContent(): Promise<AllSiteContent> {
  const defaults = Object.fromEntries(siteContentPages.map((page) => [page, getDefaultSiteContent(page)])) as AllSiteContent;
  try {
    const { data, error } = await createPublicClient().from("site_content").select("page,section,content");
    if (error) return defaults;
    const rows = (data ?? []) as SiteContentRow[];
    return Object.fromEntries(siteContentPages.map((page) => [page, rowsToContent(page, rows)])) as AllSiteContent;
  } catch {
    return defaults;
  }
}
