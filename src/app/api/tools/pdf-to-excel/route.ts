import { NextRequest, NextResponse } from "next/server";
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";
import { exec, execFile } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

async function handler(req: NextRequest, props: any, userId: string) {
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
    
    const tmpDir = os.tmpdir();
    const id = Math.random().toString(36).substring(7);
    const inputPath = path.join(tmpDir, `input_${id}.pdf`);
    const outputPath = path.join(tmpDir, `output_${id}.xlsx`);
    
    try {
      await fs.writeFile(inputPath, buffer);
      
      await new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), 'pdf_to_excel.py');
        execFile("python", [scriptPath, inputPath, outputPath], { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
          if (error) reject(new Error(stderr || error.message || "Unknown execution error"));
          else resolve(stdout);
        });
      });
      
      const outBuffer = await fs.readFile(outputPath);
      return new NextResponse(outBuffer as any, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, '')}.xlsx"`,
        },
      });
    } finally {
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    }
  } catch (err) {
    console.error("PDF to Excel Error:", err);
    return NextResponse.json(
      { error: "Failed to process PDF. Please check if the file is valid and not corrupted." },
      { status: 500 }
    );
  }
}

export const POST = withToolAuth(handler);
