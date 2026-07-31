"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTools } from "@/context/ToolsContext";
import {
  FileImage,
  Image as ImageIcon,
  Lock,
  Merge,
  ScanText,
  Split,
  Stamp,
  Text,
  RotateCw,
  FileText,
  FileCode2,
  Type,
} from "lucide-react";

type GripMenuProps = {
  open: boolean;
  onNavigate?: () => void;
  className?: string;
};

export default function GripMenu({ open, onNavigate, className }: GripMenuProps) {
  const { pdfTools } = useTools();

  const iconBySlug = useMemo(() => {
    return new Map<string, React.ComponentType<{ className?: string }>>([
      ["images-to-pdf", FileImage],
      ["pdf-to-images", ImageIcon],
      ["merge-pdfs", Merge],
      ["split-pdf", Split],
      ["watermark-pdf", Stamp],
      ["encrypt-pdf", Lock],
      ["reorder-rotate-pdf", RotateCw],
      ["pdf-to-text", ScanText],
      ["text-to-pdf", Text],
      ["markdown-to-pdf", FileText],
      ["pdf-to-md", FileText],
      ["html-to-pdf", FileCode2],
    ]);
  }, []);

  const items = useMemo(() => {
    const source = pdfTools ?? [];
    return source.map((t) => ({
      key: t.id ?? t.slug,
      label: t.name,
      href: `/tools/${t.slug}`,
      icon: iconBySlug.get(t.slug) ?? FileText,
    }));
  }, [iconBySlug, pdfTools]);

  return (
    <div
      className={`fixed left-4 right-4 top-[5.25rem] z-50 md:absolute md:left-auto md:right-0 md:top-full md:mt-3 md:w-[22rem] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={[
          "transition-all duration-150 origin-top-right",
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible",
          className ?? "",
        ].join(" ")}
        role="menu"
        aria-hidden={!open}
      >
        <div className="rounded-2xl border border-black/10 bg-white shadow-xl shadow-black/10">
          <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNavigate}
                  className="group flex flex-col items-center gap-2 rounded-xl px-3 py-3 text-center hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  role="menuitem"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-nav-text-btn-color leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="border-t border-black/10 px-3 py-2 text-center">
            <Link
              href="/pdfServices"
              onClick={onNavigate}
              className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View all PDF services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

