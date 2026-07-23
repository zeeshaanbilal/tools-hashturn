// /app/api/encrypt-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, readFile } from "fs/promises";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

const execAsync = promisify(exec);

async function handler(req: NextRequest, props: any, userId: string) {
  try {
    const authError = await requireToolAuth(req);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      return NextResponse.json({ error: "Missing file or password" }, { status: 400 });
    }

    const tmpDir = os.tmpdir();
    const id = Math.random().toString(36).substring(7);
    const inputPath = path.join(tmpDir, `encrypt_input_${id}.pdf`);
    const outputPath = path.join(tmpDir, `encrypt_output_${id}.pdf`);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(inputPath, buffer);

      await new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), 'encrypt_pdf.py');
        execFile("python", [scriptPath, inputPath, outputPath, password], { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
          if (error) reject(new Error(stderr || error.message || "Unknown execution error"));
          else resolve(stdout);
        });
      });

      const encrypted = await readFile(outputPath);

      return new NextResponse(encrypted as any, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="encrypted.pdf"',
        },
      });
    } finally {
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
    }
  } catch (error) {
    console.error("Encrypt error:", error);
    return NextResponse.json({ error: "Failed to encrypt PDF. " + (error as Error).message }, { status: 500 });
  }
}

export const POST = withToolAuth(handler);