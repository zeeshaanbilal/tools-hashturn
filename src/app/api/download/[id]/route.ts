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

    if (!file.fileData) {
      return NextResponse.json({ error: "File data not found in database" }, { status: 404 });
    }
    
    const data = file.fileData;

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

