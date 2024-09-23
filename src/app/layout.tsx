import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import "@fontsource/geist-sans/100.css";
import "@fontsource/geist-sans/200.css";
import "@fontsource/geist-sans/300.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-sans/800.css";
import "@fontsource/geist-sans/900.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cook Together",
  description: "Cook together, even in long-distance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Toaster
          richColors
          style={{ fontFamily: "Geist Sans" }}
          position="top-center"
        />
      </body>
    </html>
  );
}
