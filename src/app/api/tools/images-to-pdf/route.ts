import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { PDFDocument } from "pdf-lib";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const imageFiles = files.filter((f) => /^(image\/(png|jpe?g|webp))$/i.test(f.type));
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "No image files provided (png, jpg, jpeg)" },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();

    for (const f of imageFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      let image;
      
      try {
        if (f.type === 'image/png') {
          image = await pdfDoc.embedPng(buffer);
        } else if (f.type === 'image/jpeg' || f.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(buffer);
        } else {
          // pdf-lib only supports PNG and JPG natively. Skip unsupported.
          console.warn(`Unsupported image type: ${f.type}`);
          continue;
        }
      } catch (e) {
        console.error("Failed to embed image", e);
        continue;
      }

      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=combined-images.pdf`,
      },
    });
  } catch (err: any) {
    console.error("Images to PDF error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to convert images to PDF" },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
