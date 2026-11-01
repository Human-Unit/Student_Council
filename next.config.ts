import type { NextConfig } from "next";
import { documentCatalog } from "./src/data/student";
import { templateHeaders } from "./src/lib/template-files";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // DOCX templates download under their Russian titles, also in webviews.
  async headers() {
    return templateHeaders(documentCatalog);
  },
};

export default nextConfig;
