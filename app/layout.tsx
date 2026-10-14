import type { Metadata, Viewport } from "next";
import { Unbounded, Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Comitea - Coffee, Milk, & Tea",
  description: "Kedai offee, Milk dan Tea di Jalan Kecapi, Bekasi. Seduh segar tiap hari.",
};

export const viewport: Viewport = {
  themeColor: "#FE6B03",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
