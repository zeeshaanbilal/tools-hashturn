import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import pdfParse from "pdf-parse";
import PptxGenJS from "pptxgenjs";

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
    
    // Create PPTX
    let pres = new PptxGenJS();
    const lines = data.text.split('\n').filter(l => l.trim().length > 0);
    const linesPerSlide = 10;
    
    if(lines.length === 0) {
      let slide = pres.addSlide();
      slide.addText("Empty PDF", { x: 1, y: 1, w: 8, h: 1 });
    } else {
      for (let i = 0; i < lines.length; i += linesPerSlide) {
        let slide = pres.addSlide();
        let chunk = lines.slice(i, i + linesPerSlide).join('\n');
        slide.addText(chunk, { x: 0.5, y: 0.5, w: "90%", h: "90%", fontSize: 14, valign: "top" });
      }
    }
    
    const pptxBuffer = await pres.write({ outputType: "nodebuffer" }) as Buffer;

    return new NextResponse(pptxBuffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}.pptx"`,
      },
    });
  } catch (err: any) {
    console.error("PDF to PowerPoint Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process PDF." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
