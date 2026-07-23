"use client";

import { useState } from "react";

export default function ToolSidebar({ tools }: { tools: any[] }) {
  const [selectedTool, setSelectedTool] = useState<string>("");
  function jumpToTool(slug: string) {
    setSelectedTool(slug);

    // Keep anchor behavior for deep links + refresh.
    if (typeof window !== "undefined") window.location.hash = slug;

    const el = document.getElementById(slug);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <aside className="fixed top-20 left-0 z-40 w-full border-b bg-gray-100 md:h-screen md:w-72 md:border-b-0 md:border-r md:overflow-y-auto p-2">
        {/* Mobile: compact selector */} 
        <div className="md:hidden">
          <label className="mb-1 block text-sm text-gray-600">Jump to tool</label>
          <select
            value={selectedTool}
            onChange={(e) => jumpToTool(e.target.value)}
            className="w-full rounded border bg-white p-2 text-sm"
          >
            <option value="" disabled>
              Select a tool…
            </option>
            {tools.map((t: any) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: sidebar list */}
        <nav className="hidden md:block">
          {tools.map((t: any) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              onClick={(e) => {
                e.preventDefault();
                jumpToTool(t.slug);
              }}
              className={`block rounded p-2 ${
                selectedTool === t.slug
                  ? "bg-gray-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {t.name}
            </a>
          ))}
        </nav>
    </aside>
  );
}
  