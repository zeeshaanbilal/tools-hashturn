"use client";

import { Tool } from "@prisma/client";
import { useState } from "react";
import { uploadAndTrack } from "@/lib/fileUpload";

export default function TextInput({ tool }:{ tool: Tool}) {
    const [text, setText] = useState("");
    const [type, setType] = useState<"text" | "markdown" | "html">("text");
    const [filename, setFilename] = useState("document");
    const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) return;
    
    setIsConverting(true);
    try {
      const res = await fetch(`/api/tools/${tool.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content: text, filename })
      });
      if (!res.ok) {
        console.error(await res.json());
        return;
      }
      const blob = await res.blob();
      
      // Upload and track the processed file
      await uploadAndTrack(blob, `${filename || "document"}.pdf`, tool.slug);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ padding: "20px", width: "100%", maxWidth: 800, margin: "0 auto" }}>
        <h1 className="text-2xl font-bold">Text to PDF</h1>
        <p className="text-gray-600">Paste or type text and download a PDF file instantly.</p>
        <div className="flex gap-2 w-full">
        <select className="border border-gray-300 rounded-md p-2" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="text">Text</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
        </select>
        <input className="border border-gray-300 rounded-md p-2 flex-1" placeholder="Filename (without .pdf)" value={filename} onChange={(e) => setFilename(e.target.value)} />
        </div>
        <textarea
        className="border border-gray-300 rounded-md p-2 w-full"
        rows={16}
        placeholder={type === "markdown" ? "Enter Markdown" : type === "html" ? "Enter HTML" : "Enter text"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
        <button className="cursor-pointer px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50" onClick={handleConvert} disabled={isConverting}>
          {isConverting ? "Converting..." : "Convert"}
        </button>
    </div>
  );
}
