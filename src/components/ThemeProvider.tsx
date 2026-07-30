"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import dynamic from "next/dynamic";

import { usePathname } from "next/navigation";

const SplashGateway = dynamic(() => import("@/components/SplashGateway").then(mod => mod.SplashGateway), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot").then(mod => mod.Chatbot), { ssr: false });

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const isAcademyApp = pathname?.startsWith("/academy/signup") || 
                       pathname?.startsWith("/academy/login") || 
                       pathname?.startsWith("/academy/dashboard");

  return (
    <NextThemesProvider {...props}>
      {!isAcademyApp && <SplashGateway />}
      {children}
      {!isAcademyApp && <Chatbot />}
    </NextThemesProvider>
  );
}
