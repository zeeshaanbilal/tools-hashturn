import { NextRequest, NextResponse } from "next/server";
import { withToolAuth } from "@/lib/withToolAuth";
import sharp from "sharp";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const format = (formData.get("format") as string) || "jpeg";
    const quality = Number(formData.get("quality")) || 70;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let compressed: Buffer;

    switch (format) {
      case "jpeg":
        compressed = await sharp(buffer).jpeg({ quality }).toBuffer();
        break;
      case "png":
        compressed = await sharp(buffer).png({ quality }).toBuffer();
        break;
      case "webp":
        compressed = await sharp(buffer).webp({ quality }).toBuffer();
        break;
      case "avif":
        compressed = await sharp(buffer).avif({ quality }).toBuffer();
        break;
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }

    return new NextResponse(compressed as any, {
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename=compressed.${format}`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Compression failed" }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);
