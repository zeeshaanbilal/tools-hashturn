import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type ContentType = "text" | "markdown" | "html";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const { type, content, filename }: { type: ContentType; content: string; filename?: string } = await req.json();

    if (!content || !type) {
      return NextResponse.json({ error: "Missing 'type' or 'content' in request body" }, { status: 400 });
    }

    // Strip HTML/Markdown for a basic PDF (Vercel cannot run Puppeteer)
    const strippedContent = content.replace(/<[^>]*>?/gm, '');

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

    const safeName = (filename || "document").replace(/[^\w\-]+/g, "-");
    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${safeName}.pdf`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);
