import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { AppNavigation } from '@/components/AppNavigation';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connection Assistant",
  description: "LinkedIn Connection Assistant Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}
