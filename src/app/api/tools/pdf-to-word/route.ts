import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
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
    
    // Return text as .doc (MS Word handles plain text in .doc fine)
    return new NextResponse(data.text, {
      headers: {
        "Content-Type": "application/msword",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}.doc"`,
      },
    });
  } catch (err: any) {
    console.error("PDF to Word Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process PDF." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
