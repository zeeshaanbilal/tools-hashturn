import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromHtml } from "../utils/pdfGenerator";
import { marked } from "marked";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".md")) {
      return NextResponse.json(
        { error: "Only .md (Markdown) files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const markdownContent = buffer.toString("utf-8");

    // Convert markdown → HTML
    const htmlContent = marked.parse(markdownContent);

    // Wrap in a basic styled template (optional)
    const styledHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { margin: 0in 0.5in; }
            body { font-family: Arial, sans-serif; padding: 0.25in; line-height: 1.6; box-sizing: border-box; }
            h1, h2, h3 { color: #333; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 6px; }
            code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(styledHtml);

    return new NextResponse(pdfBuffer as any, {
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