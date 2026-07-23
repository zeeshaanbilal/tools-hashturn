import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase.admin";
import { getExtension } from "@/utils/helper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const file = await prisma.processedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Download file directly from local storage instead of Supabase
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(process.cwd(), 'public', file.storagePath as string);
    
    if (!fs.existsSync(localPath)) {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }
    
    const data = fs.readFileSync(localPath);

    // Stream with forced download headers
    return new Response(data, {
      headers: {
        "Content-Type": file.fileType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.fileName}${getExtension(file.fileType)}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

