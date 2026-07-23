"use client";

import { useState } from "react";

export default function CodeTabs({ samples }: {samples : any}) {
  const languages = Object.keys(samples);
  const [active, setActive] = useState(languages[0]);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {languages.map(lang => (
          <button
            key={lang}
            onClick={() => setActive(lang)}
            className={`rounded px-3 py-1 text-sm ${active === lang ? "bg-black text-white" : "bg-gray-200"}`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      <pre className="mt-3 overflow-x-auto rounded bg-black p-4 text-green-300">
        <code>{samples[active]}</code>
      </pre>
    </div>
  );
}
