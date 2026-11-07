
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

import { meta } from "@/data/landing.json"
import Footer from "@/components/ui/Footer";

import { cormorant, geistMono, geistSans, montserrat, playfair, poppins } from "@/fonts/fonts";

// == meat config ===================
export const metadata: Metadata = {
  title: meta.title.default,
  description: meta.description,
  keywords: meta.keywords,
  authors: meta.authors
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${cormorant.variable} ${geistMono.variable} ${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="">

        {/* ======== heaer start ======== */}
        <Header />

        {/* ======== main body start ======== */}
        {children}

        {/* ===== footer start ======= */}
        <div>
          <Footer />
        </div>

      </body>
    </html>
  );
}
