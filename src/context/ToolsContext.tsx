"use client";

import { createContext, useContext, useMemo } from "react";

export type ToolNavItem = { id: string; name: string; slug: string };

type ToolsContextValue = {
  pdfTools: ToolNavItem[];
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

export function ToolsProvider({
  pdfTools,
  children,
}: {
  pdfTools: ToolNavItem[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ pdfTools }), [pdfTools]);
  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
}

export function useTools() {
  const ctx = useContext(ToolsContext);
  if (!ctx) throw new Error("useTools must be used within ToolsProvider");
  return ctx;
}

