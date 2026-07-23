"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="cursor-pointer text-sm font-semibold px-4 py-2 text-light bg-primary rounded-lg active:bg-nav-text-btn-hover-color"
    >
      Logout
    </button>
  );
}


