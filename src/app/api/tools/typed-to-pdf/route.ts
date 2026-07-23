import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { generatePdfFromHtml } from "../utils/pdfGenerator";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

type ContentType = "text" | "markdown" | "html";

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;
    const { type, content, filename }: { type: ContentType; content: string; filename?: string } = await req.json();

    if (!content || !type) {
      return NextResponse.json({ error: "Missing 'type' or 'content' in request body" }, { status: 400 });
    }

    let htmlBody = "";
    if (type === "html") {
      htmlBody = content;
    } else if (type === "markdown") {
      htmlBody = await marked.parse(content, { breaks: true });
    } else if (type === "text") {
      htmlBody = `<pre style=\"font-family: monospace; font-size: 14px; white-space: pre-wrap;\">${escapeHtml(content)}</pre>`;
    } else {
      return NextResponse.json({ error: "Unsupported type. Use 'text', 'markdown', or 'html'" }, { status: 400 });
    }

    const htmlWithMargins = `
      <html>
        <head>
          <meta charset=\"utf-8\" />
          <style>
            @page { margin: 0in 0.5in; }
            body { padding: 0.25in; box-sizing: border-box; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>${htmlBody}</body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(htmlWithMargins);

    const safeName = (filename || "document").replace(/[^\w\-]+/g, "-");
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${safeName}.pdf`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const POST = withToolAuth(handler);
