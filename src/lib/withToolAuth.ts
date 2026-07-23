// lib/withToolAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  checkToolUsageLimit,
  checkApiLimit,
  checkFileSizeLimit,
} from "@/lib/limits";
import { getToolsBySlug } from "./db";

export function withToolAuth(handler: Function) {
  return async (req: NextRequest, props: any) => {
    try {
      // 1) Auth check
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;

      if (userId) {
        // 2) Tool usage check
        if (!(await checkToolUsageLimit(userId))) {
          return NextResponse.json({ error: "Tool usage limit reached" }, { status: 403 });
        }

        // 3) API limit check
        if (!(await checkApiLimit(userId))) {
          return NextResponse.json({ error: "API limit exceeded" }, { status: 429 });
        }

        // 4) File size check (if request contains file)
        const contentLength = req.headers.get("content-length");
        const fileSize = contentLength ? parseInt(contentLength) : 0;
        if (!(await checkFileSizeLimit(userId, fileSize))) {
          return NextResponse.json({ error: "File size exceeds your plan limit" }, { status: 413 });
        }
      }

      const url = new URL(req.url);
      const segments = url.pathname.split("/");
      const toolSlug = segments[3];

      if (!toolSlug) {
        return NextResponse.json({ error: "Invalid tool request" }, { status: 400 });
      }

      const tool = await getToolsBySlug(toolSlug);
      if (!tool) {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      }

      if (userId) {
        // 5. Log ToolUsage
        await prisma.toolUsage.create({ data: { userId, toolId: tool.id } });
        // 6) Log API usage
        await prisma.apiCall.create({ data: { userId } });
      }

      // Proceed to original handler
      return handler(req, props, userId || "guest-user");
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  };
}
