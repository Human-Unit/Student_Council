import "server-only";
import { cache } from "react";
import { documentCatalog, documentGuidance } from "@/data/student";

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
  return index < 0
    ? null
    : {
        document: documents[index],
        number: String(index + 1).padStart(2, "0"),
        information: documentGuidance[slug] ?? [],
      };
});
