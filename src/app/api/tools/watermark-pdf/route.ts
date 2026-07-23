import { NextRequest, NextResponse } from "next/server";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const text = (formData.get("text") as string) || "Watermark";

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Watermark in the middle
      page.drawText(text, {
        x: width / 2 - font.widthOfTextAtSize(text, 40) / 2,
        y: height / 2,
        size: 40,
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
        rotate: degrees(45),
      });

      // Header
      page.drawText(text, {
        x: 50,
        y: height - 40,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      // Footer
      page.drawText(text, {
        x: 50,
        y: 20,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const newPdfBytes = await pdfDoc.save();

    return new NextResponse(newPdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=watermarked.pdf",
      },
    }); 
  } catch (error: any) {
    console.error("Watermark error:", error);
    return NextResponse.json({ error: error.message || "Failed to add watermark" }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);