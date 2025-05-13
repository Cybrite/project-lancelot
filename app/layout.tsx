import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interactive Solar System",
  description: "Explore our solar system in 3D",
  icons: "/favicon.ico",
  openGraph: {
    title: "Interactive Solar System",
    description: "Explore our solar system in 3D",
    url: "https://project-lancelot.vercel.app/",
    siteName: "Interactive Solar System",
    images: [
      {
        url: "https://project-lancelot.vercel.app/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Project Lancelot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  window.__THEME__ = theme;
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
