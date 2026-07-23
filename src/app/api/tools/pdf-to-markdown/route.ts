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
    
    // Basic markdown conversion (just text for now, as pure JS doesn't do layout well)
    const markdownContent = `# Converted PDF\n\n${data.text}`;

    return new NextResponse(markdownContent, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}.md"`,
      },
    });
  } catch (err: any) {
    console.error("PDF to Markdown Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process PDF." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
