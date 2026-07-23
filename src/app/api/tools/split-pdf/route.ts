import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pages = formData.get("pages") as string;

    if (!file || !pages) {
      return NextResponse.json({ error: "Missing file or pages" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer,{ ignoreEncryption: true });

    const newPdf = await PDFDocument.create();

    const pageNumbers: number[] = [];
    const parts = pages.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = Number(startStr);
        const end = Number(endStr);
        if (isNaN(start) || isNaN(end) || start > end || start < 1) {
          throw new Error(`Invalid page range: ${trimmed}`);
        }
        for (let i = start; i <= end; i++) pageNumbers.push(i);
      } else {
        const num = Number(trimmed);
        if (isNaN(num) || num < 1) {
          throw new Error(`Invalid page number: ${trimmed}`);
        }
        pageNumbers.push(num);
      }
    }

    const totalPages = originalPdf.getPageCount();
    for (const num of pageNumbers) {
      if (num > 0 && num <= totalPages) {
        const [copiedPage] = await newPdf.copyPages(originalPdf, [num - 1]);
        newPdf.addPage(copiedPage);
      } else {
         throw new Error(`Page number ${num} is out of bounds. The PDF has ${totalPages} pages.`);
      }
    }

    if (newPdf.getPageCount() === 0) {
      throw new Error("No valid pages were selected to split.");
    }

    const newPdfBytes = await newPdf.save();

    return new NextResponse(newPdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=split.pdf",
      },
    });
  } catch (error: any) {
    console.error("Split error:", error);
    return NextResponse.json({ error: error.message || "Failed to split PDF" }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);
