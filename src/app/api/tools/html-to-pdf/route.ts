import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file.name.endsWith(".html") || file.name.endsWith(".htm"))) {
      return NextResponse.json(
        { error: "Only .html or .htm files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const htmlContent = buffer.toString("utf-8");

    // We strip HTML formatting for basic PDF (Vercel cannot run Puppeteer)
    const strippedContent = htmlContent.replace(/<[^>]*>?/gm, '');

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Very basic text to PDF logic
    const lines = strippedContent.split('\n');
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let y = height - 50;
    
    for (const line of lines) {
        if (y < 50) {
            page = pdfDoc.addPage();
            y = height - 50;
        }
        page.drawText(line.substring(0, 100), {
            x: 50,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        y -= 15;
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${file.name.replace(/\.\w+$/, "")}.pdf`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);