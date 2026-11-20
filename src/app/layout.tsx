import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProviderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "QLUB Platform — White-Label Restaurant SaaS",
  description:
    "Multi-tenant white-label digital menus, QR table ordering, brand editor, and operations console for restaurant portfolios.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#c8a66a]/25 selection:text-[#f5f5f1]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
