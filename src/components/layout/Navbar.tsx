"use client";
import { useEffect, useRef, useState } from "react";
import { Grip, Menu } from "lucide-react";
import Logo from "../assets/Logo";
import SignInButton from "../Navbar/SignInButton";
import SignUpButton from "../Navbar/SignUpButton";
import LogoutButton from "../Navbar/LogoutButton";
import { useSession } from "next-auth/react";
import MobileMenu from "../Navbar/MobileMenu";
import Link from "next/link";
import GripMenu from "../Navbar/GripMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const buttons = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "PDF Services", href: "/pdfServices" },
    { label: "Other Services", href: "/otherServices" },
    { label: "API", href: "/apiAccess" },
    { label: "Contact Us", href: "/contact" }
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLDivElement | null>(null);

  const [gripOpen, setGripOpen] = useState(false);
  const gripMenuRef = useRef<HTMLDivElement | null>(null);
  const gripButtonDesktopRef = useRef<HTMLDivElement | null>(null);
  const gripButtonMobileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      )
        setMenuOpen(false);

      if (
        gripMenuRef.current &&
        !gripMenuRef.current.contains(target) &&
        !(gripButtonDesktopRef.current?.contains(target) ?? false) &&
        !(gripButtonMobileRef.current?.contains(target) ?? false)
      )
        setGripOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setGripOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="font-sans w-full m-0 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          <div className="flex-shrink-0 flex items-center">
            <Logo
              width="45px"
              height="45px"
              baseTextSize="text-2xl"
              mediumTextSize="text-3xl"
              subTitleTextSize="text-[0.65rem]"
            />
          </div>

          <div className="hidden md:flex sm:items-center space-x-2">
            {buttons.map((btn, i) => (
              <Link
                href={btn.href}
                className={`text-sm font-semibold transition-all duration-200 rounded-md px-4 py-2 ${
                  pathname === btn.href 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                key={i}
              >
                {btn.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center space-x-4">
            {status !== "loading" && (
              session ? (
                <LogoutButton />
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton />
                  <SignUpButton />
                </div>
              )
            )}
            <div ref={gripButtonDesktopRef} className="ml-2 flex items-center">
              <div 
                className="p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer group"
                onClick={() => setGripOpen((v) => !v)}
                aria-label="Open tools menu"
                role="button"
              >
                <Grip className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          </div>

          {/* mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <div ref={gripButtonMobileRef}>
              <div 
                className="p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => setGripOpen((v) => !v)}
                aria-label="Open tools menu"
                role="button"
              >
                <Grip className="w-5 h-5 text-slate-300" />
              </div>
            </div>
            <div
              ref={menuButtonRef}
              className={`p-2 rounded-full hover:bg-slate-800 transition-all duration-200 cursor-pointer text-slate-300 ${
                menuOpen ? "bg-slate-800" : ""
              }`}
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              <Menu className="w-6 h-6" />
            </div>
          </div>

          <div
            ref={gripMenuRef}
            className="fixed left-4 right-4 top-[5.25rem] z-50 md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-[24rem]"
          >
            <GripMenu open={gripOpen} onNavigate={() => setGripOpen(false)} />
          </div>
        </div>

        {/* mobile menu */}
        <div ref={menuRef}>
          <MobileMenu buttons={buttons} menuOpen={menuOpen} pathName={pathname + ""} />
        </div>
      </div>
    </div>
  );
}
