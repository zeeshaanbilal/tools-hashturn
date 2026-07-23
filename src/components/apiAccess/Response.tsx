export default function SampleResponse({ response }: {response:any}) {
    return (
      <div className="mt-4">
        {Object.entries(response).map(([code, json]) => (
          <div key={code} className="mb-4">
            <div className="font-semibold mb-1">Response {code}</div>
            <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-sm text-green-300">
              {JSON.stringify(json, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }
  