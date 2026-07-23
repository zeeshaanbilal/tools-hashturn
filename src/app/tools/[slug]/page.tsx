import FileUpload from "@/components/Tools/FileUpload";
import ImageConversion from "@/components/Tools/ImageConversion";
import TextInput from "@/components/Tools/TextInput";
import { getToolsBySlug } from "@/lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  
  const { slug } = await params;

  if (!session) {
    redirect(`/auth/login?callbackUrl=/tools/${slug}`);
  }

  const tool = await getToolsBySlug(slug);

  if (!tool) return <div>Tool not found</div>;

  return (
    <div>
      {(tool.type === "file" || tool.type === "pdf") && <FileUpload tool={tool} />}
      {tool.type === "text" && <TextInput tool={tool} />}
      {tool.type === "image" && <ImageConversion tool={tool} />}
    </div>
  );
}
