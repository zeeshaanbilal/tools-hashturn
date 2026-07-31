import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: data.text.split('\n').map(line => new Paragraph({
                children: [new TextRun(line)]
            }))
        }]
    });
    
    const docxBuffer = await Packer.toBuffer(doc);

    return new NextResponse(docxBuffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}.docx"`,
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
