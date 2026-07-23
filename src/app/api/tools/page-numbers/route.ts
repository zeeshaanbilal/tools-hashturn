import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument, rgb } from "pdf-lib";

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
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const text = `Page ${i + 1} of ${pages.length}`;
      
      // We estimate width of text
      const textSize = 12;
      const textWidth = text.length * 6; // Rough estimate
      
      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: 20,
        size: textSize,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}-numbered.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Page Numbers Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to add page numbers." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
