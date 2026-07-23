"use client";

import { SessionProvider } from "next-auth/react";
import { ToolsProvider, type ToolNavItem } from "@/context/ToolsContext";

export default function AppProviders({
  children,
  pdfTools,
}: {
  children: React.ReactNode;
  pdfTools: ToolNavItem[];
}) {
  return (
    <SessionProvider>
      <ToolsProvider pdfTools={pdfTools}>{children}</ToolsProvider>
    </SessionProvider>
  );
}

