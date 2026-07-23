import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, degrees } from "pdf-lib";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const order = formData.get("order") as string;
    const rotations = formData.get("rotations") as string;

    if (!file || !order) {
      return NextResponse.json({ error: "Missing file or order" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer,  { ignoreEncryption: true });

    const pageCount = originalPdf.getPageCount();
    const newPdf = await PDFDocument.create();

    const orderArray = order.split(",").map((n) => Number(n.trim()));

    const rotationArray = rotations
      ? rotations.split(",").map((n) => Number(n.trim()))
      : [];

    for (let i = 0; i < orderArray.length; i++) {
      const pageNum = orderArray[i];
      if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
        throw new Error(`Invalid or out of bounds page number: ${order.split(",")[i]}`);
      }
      
      const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNum - 1]);

      if (rotationArray[i] && !isNaN(rotationArray[i])) {
        copiedPage.setRotation(degrees(rotationArray[i]));
      }

      newPdf.addPage(copiedPage);
    }

    if (newPdf.getPageCount() === 0) {
      throw new Error("No valid pages selected.");
    }

    const newPdfBytes = await newPdf.save();

    return new NextResponse(newPdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=reordered.pdf",
      },
    });
  } catch (error: any) {
    console.error("Reorder/Rotate error:", error);
    return NextResponse.json({ error: error.message || "Failed to reorder/rotate PDF" }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);