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

    if (!file || !(file.name.endsWith(".html") || file.name.endsWith(".htm"))) {
      return NextResponse.json(
        { error: "Only .html or .htm files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const htmlContent = buffer.toString("utf-8");

    const htmlWithMargins = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { margin: 0in 0.5in; }
            body { padding: 0.25in; box-sizing: border-box; }
          </style>
        </head>
        <body>${htmlContent}</body>
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