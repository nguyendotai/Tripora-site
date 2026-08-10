import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/shared/components/navbar";
import { Footer } from "@/shared/components/footer";
import { IntroSplash } from "@/shared/components/intro-splash";

const googleSans = Google_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Tripora",
  description: "Tripora - Booking/Travel Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${googleSans.variable} ${googleSansCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <IntroSplash />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
