import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import LayoutChrome from "@/components/layout/LayoutChrome";
import { getToolsByCategory } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Next.js DATABASE_URL:", process.env.DATABASE_URL);
  const pdfTools = await getToolsByCategory("PDFTools");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProviders
          pdfTools={pdfTools.map((t) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
          }))}
        >
          <LayoutChrome>{children}</LayoutChrome>
        </AppProviders>
      </body>
    </html>
  );
}
