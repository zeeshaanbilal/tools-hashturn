import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromHtml } from "../utils/pdfGenerator";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const imageFiles = files.filter((f) => /^(image\/(png|jpe?g|webp))$/i.test(f.type));
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "No image files provided (png, jpg, jpeg, webp)" },
        { status: 400 }
      );
    }

    // Build a simple HTML document that lays out each image on its own page
    const parts: string[] = [];
    for (const f of imageFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = f.type || "image/png";
      parts.push(`
        <div class="page">
          <img src="data:${mime};base64,${base64}" />
        </div>
      `);
    }

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            .page { page-break-after: always; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
            .page:last-child { page-break-after: auto; }
          </style>
        </head>
        <body>
          ${parts.join("\n")}
        </body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(html);

    return new NextResponse(pdfBuffer as any, {
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
