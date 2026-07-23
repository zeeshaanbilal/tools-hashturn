// /app/api/encrypt-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string | null;

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only .pdf files are supported" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Encryption is currently not supported on this Vercel environment because it requires native Python/C++ binaries." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Encrypt PDF Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to encrypt PDF." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);