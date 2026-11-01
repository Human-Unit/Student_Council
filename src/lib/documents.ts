import "server-only";
import { cache } from "react";
import previews from "@/data/document-previews.json";
import { documentCatalog, documentGuidance } from "@/data/student";

export type DocumentPreview = { src: string; width: number; height: number };

/** Rendered by scripts/render-document-previews.sh from the DOCX originals. */
const documentPreviews: Partial<Record<string, DocumentPreview>> = previews;

/**
 * Server-only v1 adapter. API integration is deliberately deferred until the
 * documents migration/backend release is approved; never silently fall back
 * from API failures to stale static content. Replace this adapter, not the UI.
 */
export const getDocuments = cache(async () =>
  documentCatalog
    .filter((document) => document.is_published)
    .toSorted(
      (a, b) => a.sort_order - b.sort_order || a.slug.localeCompare(b.slug),
    ),
);

export const getDocument = cache(async (slug: string) => {
  const documents = await getDocuments();
  const index = documents.findIndex((document) => document.slug === slug);
  if (index < 0) return null;
  const document = documents[index];
  return {
    document,
    number: String(index + 1).padStart(2, "0"),
    information: documentGuidance[slug] ?? [],
    // A preview without its downloadable original would be misleading.
    preview: document.template_url ? (documentPreviews[slug] ?? null) : null,
  };
});
