import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { IntroSplash } from "@/shared/components/intro-splash";

const fontSans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripora — Discover, Plan, and Explore",
  description:
    "Tripora giúp bạn khám phá điểm đến, đọc cẩm nang du lịch và lập kế hoạch cho chuyến đi tiếp theo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <IntroSplash />
          {children}
        </Providers>
      </body>
    </html>
  );
}
