import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// NT Somic — the brandbook typeface (SIL OFL 1.1, see fonts/OFL.txt).
const ntSomic = localFont({
  src: "./fonts/NTSomic-VF.woff2",
  variable: "--font-sans",
  weight: "400 700",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

// TODO(deploy): set NEXT_PUBLIC_SITE_URL to the production domain so that
// Open Graph image URLs are absolute. On Vercel the production URL is used
// automatically until then.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Студенческий совет | Филиал МГУ в Душанбе";
const description =
  "Студенческий совет филиала МГУ в Душанбе: создаём проекты, события и возможности для студентов. Секторы ИПОС, КМТС и ОСПС, анкеты для первокурсников и контакты.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Студсовет МГУ Душанбе",
  openGraph: {
    title,
    description:
      "Создаём проекты, события и возможности для студентов филиала МГУ в Душанбе.",
    type: "website",
    locale: "ru_RU",
    siteName: "Студенческий совет филиала МГУ в Душанбе",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#3A53D1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={ntSomic.variable}>
      <body>{children}</body>
    </html>
  );
}
