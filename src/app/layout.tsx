import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import JotaiProvider from "./providers/jotai-provider";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BVNK HPP",
  description: "A demo app for the BVNK HPP",
};
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // dehydrate the queryClient state to be shared between the client and server

  return (
    <html lang="en">
      <body
        className={`${interSans.className} ${geistMono.variable} antialiased h-screen w-screen`}
      >
        <JotaiProvider>
          <div className="flex items-center justify-center h-full w-full px-4 sm:px-8">
            {children}
          </div>
        </JotaiProvider>
      </body>
    </html>
  );
}
