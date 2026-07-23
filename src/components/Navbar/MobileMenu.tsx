"use client";
import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface props {
  buttons: { label: string; href: string; }[]
  menuOpen: boolean;
  pathName: string;
}
export default function MobileMenu({ buttons, menuOpen, pathName }: props) {
  const { data: session, status } = useSession();
  return (
    <div
      className={`md:hidden bg-white border-t-2 overflow-hidden transition-all duration-500 ease-in-out ${
        menuOpen ? "max-h-100 opacity-100 mt-0 pt-2 pb-4" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col">
        {buttons.map((btn, i) => (
          <Link
            href={btn.href}
            className={`text-sm font-medium text-nav-text-btn-color ${pathName === btn.href ? "bg-primary rounded-lg text-white p-2": "hover:text-nav-text-btn-hover-color"}  active:text-nav-text-btn-active-color mr-4`}
            key={i}
          >
            {btn.label}
          </Link>
        ))}
        <div className="flex justify-between items-center border-t-2 pt-2">
          {status !== "loading" && (
            session ? (
              <LogoutButton />
            ) : (
              <>
                <SignInButton />
                <SignUpButton verticalPadding="py-1" />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
