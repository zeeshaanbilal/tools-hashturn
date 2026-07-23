import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

const execFileAsync = promisify(execFile);

async function handler(req: NextRequest, props: any, userId: string) {
  let inputPath = "";
  let outputPath = "";

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
    const uniqueId = crypto.randomUUID();
    inputPath = path.join(os.tmpdir(), `${uniqueId}_input.pdf`);
    outputPath = path.join(os.tmpdir(), `${uniqueId}_output.zip`);

    await writeFile(inputPath, buffer);

    try {
      const scriptPath = path.join(process.cwd(), 'pdf_to_images.py');
      await execFileAsync("python", [scriptPath, inputPath, outputPath], { maxBuffer: 1024 * 1024 * 50 });
    } catch (execError: any) {
      console.error("PDF to Images Python execution error:", execError.stderr || execError.message);
      throw new Error("Failed to process PDF file. Please ensure it is a valid, uncorrupted PDF.");
    }

    const zipBuffer = await readFile(outputPath);

    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}-pages.zip"`,
      },
    });
  } catch (err) {
    console.error("PDF to Images error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  } finally {
    if (inputPath) await unlink(inputPath).catch(() => {});
    if (outputPath) await unlink(outputPath).catch(() => {});
  }
}

export const POST = withToolAuth(handler);