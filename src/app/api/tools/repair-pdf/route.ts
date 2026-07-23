import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument } from "pdf-lib";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only .pdf files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Loading and saving often fixes cross-reference tables and corrupt objects
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}-repaired.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Repair PDF Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to repair PDF. The file might be too corrupted." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
