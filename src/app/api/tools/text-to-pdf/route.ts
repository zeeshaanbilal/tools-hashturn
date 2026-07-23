import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromHtml } from "../utils/pdfGenerator";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only .txt files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const textContent = buffer.toString("utf-8");

    // Wrap plain text with margins for PDF
    const htmlWithMargins = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { margin: 0in 0.5in; }
            body { padding: 0.25in; box-sizing: border-box; }
            pre { font-family: monospace; font-size: 14px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${textContent}</pre>
        </body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(htmlWithMargins);

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