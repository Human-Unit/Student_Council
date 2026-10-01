import type { Metadata } from "next";
import { Manrope, PT_Serif } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const ptSerif = PT_Serif({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Студенческий совет | Филиал МГУ в Душанбе",
  description:
    "Студенческий совет филиала МГУ в Душанбе — студенческие инициативы, проекты, события и обратная связь.",
  openGraph: {
    title: "Студенческий совет | Филиал МГУ в Душанбе",
    description:
      "Студенческие инициативы, проекты, события и обратная связь филиала МГУ в Душанбе.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${ptSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
