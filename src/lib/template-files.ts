/**
 * Download naming for DOCX templates. URLs keep stable ASCII slugs
 * (/documents/templates/<slug>.docx); the saved file gets the Russian title.
 * Shared by the download links and by next.config.ts response headers.
 */

type TemplateFile = { title: string; template_url: string | null };

const STATIC_PREFIX = "/documents/templates/";

/** Name of the file in the student's Downloads folder. */
export function downloadName(document: { title: string }): string {
  return `${document.title}.docx`;
}

/** RFC 5987 value: encodeURIComponent leaves ' ( ) * unescaped. */
function encodeRfc5987(value: string): string {
  return encodeURIComponent(value).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/**
 * RFC 6266 header with an ASCII fallback for old clients and the UTF-8 title.
 * Webviews (Telegram, Instagram) ignore the `download` attribute, so the
 * header is what names the file there.
 */
export function contentDisposition(document: {
  title: string;
  template_url: string;
}): string {
  const fallback = document.template_url.slice(
    document.template_url.lastIndexOf("/") + 1,
  );
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeRfc5987(downloadName(document))}`;
}

/** next.config.ts `headers()` entries for templates served from /public. */
export function templateHeaders(documents: readonly TemplateFile[]) {
  return documents.flatMap((document) =>
    document.template_url?.startsWith(STATIC_PREFIX)
      ? [
          {
            source: document.template_url,
            headers: [
              {
                key: "Content-Disposition",
                value: contentDisposition({
                  title: document.title,
                  template_url: document.template_url,
                }),
              },
            ],
          },
        ]
      : [],
  );
}
