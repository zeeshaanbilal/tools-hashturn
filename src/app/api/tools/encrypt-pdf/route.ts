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

    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);
    
    const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
    const encryptedBytes = await encryptPDF(pdfBytes, password);

    return new NextResponse(encryptedBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=encrypted.pdf`,
      },
    });
  } catch (err: any) {
    console.error("Encrypt PDF Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to encrypt PDF." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);