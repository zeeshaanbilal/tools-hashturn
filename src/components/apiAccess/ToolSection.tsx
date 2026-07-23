import HeadersTable from "./HeadersTable";
import CodeTabs from "./CodeTabs";
import SampleResponse from "./Response";

export default function ToolSection({ tool }: { tool: any }) {
  
  return (
    <section
      id={tool.slug}
      className="mb-10 rounded-xl border bg-white p-4 sm:mb-14 sm:p-6"
    >
      <h2 className="mb-2 text-xl font-semibold sm:text-2xl">{tool.name}</h2>
      <p className="mb-4 text-gray-600">{tool.description}</p>

      <h3 className="font-bold mt-6 mb-2">Endpoint</h3>
      <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
        {tool.endpoint}
      </pre>

      <h3 className="font-bold mt-6 mb-2">Headers</h3>
      <HeadersTable headers={tool.headers} />

      <h3 className="font-bold mt-6 mb-2">Request Samples</h3>
      <CodeTabs samples={tool.sampleRequest} />

      <h3 className="font-bold mt-6 mb-2">Sample Responses</h3>
      <SampleResponse response={tool.sampleResponse} />
    </section>
  );
}
