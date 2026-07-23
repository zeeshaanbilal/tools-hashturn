import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase.admin";
import { getToolsBySlug } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const toolSlug = formData.get("toolSlug") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    // Extract metadata
    const originalName = file.name;
    const fileExt = originalName.split(".").pop() || "bin";
    const fileType = file.type || `application/${fileExt}`;
    const fileSize = file.size;

    let toolId: string | null = null;
    if (toolSlug) {
      const tool = await getToolsBySlug(toolSlug);
      toolId = tool?.id || null;
    }

    const uniqueId = crypto.randomUUID();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Instead of Supabase, save locally
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'processed-files', session.user.id);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const localPath = path.join(uploadsDir, `${uniqueId}.${fileExt}`);
    const storagePath = `processed-files/${session.user.id}/${uniqueId}.${fileExt}`;
    
    fs.writeFileSync(localPath, buffer);

    const saved = await prisma.processedFile.create({
      data: {
        userId: session.user.id,
        toolId,
        fileName: originalName,
        fileSize,
        fileType,
        storagePath, // save relative path
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      storagePath,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
