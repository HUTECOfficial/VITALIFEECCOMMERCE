"use client";

import { useEffect, useState } from "react";
import {
  getDefaultSiteContent,
  mergeSiteContent,
  type SiteContentPage,
  type SitePageContent,
} from "@/data/siteContent";

export function useSiteContent(page: SiteContentPage): SitePageContent {
  const [state, setState] = useState<{ page: SiteContentPage; content: SitePageContent }>(() => ({
    page,
    content: getDefaultSiteContent(page),
  }));

  useEffect(() => {
    let active = true;
    fetch(`/api/content/${page}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el contenido");
        return response.json();
      })
      .then((value: unknown) => {
        if (active) setState({ page, content: mergeSiteContent(page, value) });
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [page]);

  return state.page === page ? state.content : getDefaultSiteContent(page);
}
