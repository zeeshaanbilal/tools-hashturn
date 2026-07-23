"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbarFooterOn = new Set(["/auth/login"]);
  const shouldHide = hideNavbarFooterOn.has(pathname ?? "");

  return (
    <div className="bg-secondary">
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </div>
  );
}

