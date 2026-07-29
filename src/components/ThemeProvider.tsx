"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import dynamic from "next/dynamic";

const SplashGateway = dynamic(() => import("@/components/SplashGateway").then(mod => mod.SplashGateway), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot").then(mod => mod.Chatbot), { ssr: false });

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <SplashGateway />
      {children}
      <Chatbot />
    </NextThemesProvider>
  );
}
