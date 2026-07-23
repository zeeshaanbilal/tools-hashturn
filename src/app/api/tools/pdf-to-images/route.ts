import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import JSZip from "jszip";
import pdfParse from "pdf-parse";

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
    
    // Parse the PDF
    const data = await pdfParse(buffer);
    
    // Create a zip file containing the extracted text as a fallback
    // Note: Full image rasterization requires native binaries (like Python/Puppeteer)
    const zip = new JSZip();
    zip.file(`extracted_text.txt`, data.text);
    
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}-text-fallback.zip"`,
      },
    });
  } catch (err: any) {
    console.error("PDF to Images error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process PDF file." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);