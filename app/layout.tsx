import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { themeBootScript } from "@/lib/theme";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShareClub",
  description: "Real perks for real shareholders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{ __html: themeBootScript() }}
        />
        <CurrencyProvider>
          <Header />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
