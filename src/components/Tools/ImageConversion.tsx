"use client";

import { useRef, useState } from "react";
import UploadContainer from "./UploadContainer";
import { useFileQueue } from "@/store/fileQueue";
import AboutCTA from "../Home/CTA";
import FileList from "./FileList";
import { Tool } from "@prisma/client";

export default function ImageConversion({tool}:{tool : Tool}){
    const [body, setBody] = useState<Record<string,any>>({
        quality: 50
    });
    const {
        queue,
        addFiles,
        removeFile,
        process,
        isProcessing,
      } = useFileQueue();
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        addFiles(Array.from(e.dataTransfer.files));
    };
    const handleSubmit = () => {
        process(`/api/tools/${tool.slug}`, body, "sequential");
      };
    return (
        <div className="flex flex-col items-center justify-center p-16 gap-4">
            <h1 className="text-2xl font-bold">Image Services</h1>
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
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-bold">Choose Format</span>
                <select 
                    className="border border-gray-300 rounded-md p-2" 
                    name="format" 
                    id="format" 
                    onChange={(e) => setBody({ ...body, format: e.target.value })}
                >
                    <option value="avif">AVIF</option>
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                </select>
            </div>
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-bold">Quality</span>
                <input 
                    className="border border-gray-300 rounded-md p-2" 
                    placeholder="quality" 
                    type="range" 
                    name="quality" 
                    id="quality" 
                    min={0} 
                    max={100} 
                    value={body.quality} 
                    onChange={(e) => setBody({ ...body, quality: Number(e.target.value) })}
                />
                <span className="text-sm font-bold">{body.quality}</span>
            </div>
            <FileList
                queue={queue}
                removeFile={(id) => removeFile(id)}
            />

            {queue.length > 0 && (
                <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="cursor-pointer px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                {isProcessing
                    ? "Processing..."
                    : `Process ${queue.length} File(s)`}
                </button>
            )}

            <AboutCTA />
            
        </div>
    );
}