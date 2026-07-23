// app/auth/verify/VerifyClient.tsx
"use client"
import { useEffect } from "react";
import { use } from "react";

export default function VerifyClient({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const params = use(searchParams);

  useEffect(() => {
    const token = params?.token;
    const email = params?.email;
    if (token && email) {
      window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    } else {
      window.location.href = "/auth/login?verified=0";
    }
  }, [params]);

  return null;
}