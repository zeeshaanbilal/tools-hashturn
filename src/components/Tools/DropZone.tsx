"use client";

import { ChevronDown, UploadCloud, Camera } from "lucide-react";
import { useRef } from "react";

interface DropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DropZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
}: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => fileInputRef.current?.click();
  const openCameraPicker = () => cameraInputRef.current?.click();

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-5 transition-all duration-300 rounded-2xl ${
        isDragging ? "bg-blue-50 scale-[1.01]" : "bg-transparent"
      }`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={`absolute inset-4 rounded-xl border-2 border-dashed transition-all duration-300 pointer-events-none ${
        isDragging ? "border-blue-400 bg-blue-50/50" : "border-slate-300"
      }`}></div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={onFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-500"}`}>
        <UploadCloud size={48} strokeWidth={1.5} />
      </div>

      <button
        onClick={openFilePicker}
        className="
          flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 
          text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5
          z-10 cursor-pointer
        "
      >
        <span className="text-xl">📁</span>
        <span>CHOOSE FILES</span>
        <span className="border-l border-blue-400 pl-2 ml-2 flex items-center">
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <p className="text-sm text-slate-400 z-10 font-medium tracking-wide">or drop files here</p>
    </div>
  );
}
