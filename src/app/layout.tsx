import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { BRAND } from "@/config/brand";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: `${BRAND.name} | ${BRAND.slogan}`, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} | ${BRAND.slogan}`,
    description: BRAND.description,
    url: BRAND.url,
  },
  twitter: { card: "summary_large_image", site: BRAND.xHandle, creator: BRAND.xHandle },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        {/* Erode (display serif) and Supreme (text sans) from Fontshare, free for commercial use. */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=erode@300,301,400,401,500,501,600,700&f[]=supreme@300,400,500,700&display=swap" />
      </head>
      <body>
        <WalletProvider>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
