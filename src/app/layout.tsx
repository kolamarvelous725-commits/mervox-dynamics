import type { Metadata } from "next";
import { Sora, Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Chatbot } from "@/components/Chatbot";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["italic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mervox Dynamic | Premium Digital Agency",
  description: "We design, build, and grow premium digital experiences. Specialist web design, development, brand identity, and marketing for forward-thinking brands.",
  keywords: ["Web Design", "Web Development", "Digital Agency", "Brand Identity", "E-commerce", "Marketing"],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "96x96", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
