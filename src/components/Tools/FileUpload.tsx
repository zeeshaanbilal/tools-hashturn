"use client";

import AboutCTA from "@/components/Home/CTA";
import UploadContainer from "./UploadContainer";
import FileList from "./FileList";
import { Tool } from "@prisma/client";
import { useFileQueue } from "@/store/fileQueue";
import { useState, useEffect } from "react";

export default function FileUpload({ tool }: { tool: Tool }) {
  const [body, setBody] = useState<Record<string,any>>({});

  const {
    queue,
    addFiles,
    removeFile,
    process,
    isProcessing,
    batchResultUrl,
    batchResultFilename,
  } = useFileQueue();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSubmit = () => {
    if(tool.slug === "merge-pdfs" || tool.slug === "images-to-pdf"){
      process(`/api/tools/${tool.slug}`, body, "batch");
      return;
    }
    process(`/api/tools/${tool.slug}`, body, "sequential");
  };

  const requiresManualSubmit = ["watermark-pdf", "split-pdf", "encrypt-pdf", "reorder-rotate-pdf", "merge-pdfs", "images-to-pdf"].includes(tool.slug);

  // Auto-process if no extra inputs are needed
  useEffect(() => {
    if (queue.length > 0 && !isProcessing && !requiresManualSubmit) {
      const allQueued = queue.every(q => q.status === "queued");
      if (allQueued) {
        handleSubmit();
      }
    }
  }, [queue, isProcessing, requiresManualSubmit]);

  return (
    <div className="w-full flex flex-col justify-center items-center py-20 space-y-28">
      {queue.length === 0 && (
        <UploadContainer
          isDragging={false}
          handlers={{
            onDragEnter: () => {},
            onDragLeave: () => {},
            onDragOver: (e) => e.preventDefault(),
            onDrop: handleDrop,
            onFileChange: handleFileChange,
          }}
        />
      )}

      {tool.slug === "watermark-pdf" && (
        <div className="w-full lg:w-[65%]">
          <input 
            type="text" 
            placeholder="Enter watermark text" 
            className="w-full border border-gray-300 rounded-md p-2" 
            value={body.text || ""} 
            onChange={(e) => setBody({ ...body, text: e.target.value })}
          />
        </div>
      )}

       {tool.slug === "split-pdf" && (
        <div className="w-full lg:w-[65%]">
          <input 
            type="text" 
            placeholder="Enter pages to split (e.g. 1,2,3-5,7)" 
            className="w-full border border-gray-300 rounded-md p-2" 
            value={body.pages || ""} 
            onChange={(e) => setBody({ ...body, pages: e.target.value })}
          />
        </div>
      )}

      {tool.slug === "encrypt-pdf" && (
        <div className="w-full lg:w-[65%]">
          <input 
            type="text" 
            placeholder="Enter Password for encryption" 
            className="w-full border border-gray-300 rounded-md p-2" 
            value={body.password || ""} 
            onChange={(e) => setBody({ ...body, password: e.target.value })}
          />
        </div>
      )}

      {tool.slug === "reorder-rotate-pdf" && (
        <div className="w-full lg:w-[65%] ">
          <input 
            type="text" 
            placeholder="Order (e.g. 3,1,2)" 
            className="w-full border border-gray-300 rounded-md p-2" 
            value={body.order || ""} 
            onChange={(e) => setBody({ ...body, order: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Rotations (e.g. 0,90,180)" 
            className="mt-2 w-full border border-gray-300 rounded-md p-2" 
            value={body.rotations || ""} 
            onChange={(e) => setBody({ ...body, rotations: e.target.value })}
          />
        </div>
      )}

      <FileList
        queue={queue}
        removeFile={(id) => removeFile(id)}
      />

      {queue.length > 0 && requiresManualSubmit && !isProcessing && !batchResultUrl && (
        <button
          onClick={handleSubmit}
          className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Process {queue.length} File(s)
        </button>
      )}

      {batchResultUrl && (
        <a
          href={batchResultUrl}
          download={batchResultFilename || "merged.pdf"}
          className="flex items-center justify-center py-4 px-8 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:-translate-y-1"
        >
          Download Merged File
        </a>
      )}

      <AboutCTA />
    </div>
  );
}
