import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const url = formData.get("url") as string | null;

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "A valid URL (starting with http or https) is required" },
        { status: 400 }
      );
    }

    // Call Microlink API to convert URL to PDF
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&pdf=true&meta=false`);
    if (!response.ok) {
        throw new Error("Failed to generate PDF from URL");
    }
    const data = await response.json();
    
    if (!data.data || !data.data.pdf || !data.data.pdf.url) {
        throw new Error("PDF generation failed. The website might be blocking access.");
    }
    
    // Fetch the actual PDF bytes
    const pdfResponse = await fetch(data.data.pdf.url);
    if(!pdfResponse.ok) throw new Error("Failed to download generated PDF");
    const pdfBlob = await pdfResponse.blob();
    const pdfBytes = await pdfBlob.arrayBuffer();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=website.pdf`,
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