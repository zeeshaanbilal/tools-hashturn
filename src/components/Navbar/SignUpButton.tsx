"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface props {
  verticalPadding?: string;
}
export default function SignUpButton({ verticalPadding = "py-2" }: props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session) {
    return null;
  }

  return (
    <Link
      href="/auth/login"
      className={`text-sm font-semibold px-4 ${verticalPadding} text-light pricing-grad-bg rounded-full`}
    >
      Sign up
    </Link>
  );
}
