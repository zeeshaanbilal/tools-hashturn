
import GenerateTokenButton from "@/components/apiAccess/GenerateToken";
import ToolSection from "@/components/apiAccess/ToolSection";
import ToolSidebar from "@/components/apiAccess/ToolSidebar";
import { tools } from "@/content/tools";

export default async function ApiAccess() {
  return (
    <div className="min-h-screen">
      <ToolSidebar tools={tools} />

      <div className="pt-20 md:ml-72 md:pt-0 min-w-0 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold sm:text-3xl">API Access</h1>
          <GenerateTokenButton />
        </div>

        {tools.map((tool) => (
          <ToolSection key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
