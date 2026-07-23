import { QueueItem } from "@/store/fileQueue";
import { useState, useEffect } from "react";
import {
  FileText,
  FileImage,
  FileType,
  FileArchive,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface FileItemProps {
  item: QueueItem;
  onRemove: () => void;
}

export default function FileItem({ item, onRemove }: FileItemProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (item.status === "uploading") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + (100 / 15); // Reaches 100% in ~1.5s
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [item.status]);

  const getIcon = () => {
    if (item.status === "done") return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    if (item.status === "verifying" || item.status === "processing") 
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;

    if (item.file.type.includes("pdf")) return <FileType className="w-6 h-6" />;
    if (item.file.type.includes("image")) return <FileImage className="w-6 h-6" />;
    if (item.file.name.endsWith(".txt")) return <FileText className="w-6 h-6" />;
    if (item.file.name.endsWith(".zip")) return <FileArchive className="w-6 h-6" />;
    return <FileType className="w-6 h-6" />;
  };

  return (
    <div className="flex flex-col p-4 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {/* ICON */}
        <div className="text-gray-400 shrink-0">{getIcon()}</div>

        {/* FILE INFO */}
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="font-semibold text-gray-900 truncate">{item.file.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 font-medium">
                {Math.ceil(item.file.size / 1024)} KB
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className={`text-xs font-semibold capitalize
                ${item.status === "error" ? "text-red-500" : ""}
                ${item.status === "done" ? "text-green-500" : ""}
                ${["uploading", "verifying", "processing"].includes(item.status) ? "text-blue-500" : ""}
                ${item.status === "queued" ? "text-gray-500" : ""}
              `}>
                {item.status} {item.status === "uploading" && `${Math.round(progress)}%`}
              </span>
            </div>
            {item.error && (
              <div className="mt-1.5 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 font-medium">
                Failed: {item.error}
              </div>
            )}
          </div>
        </div>

        {/* REMOVE BUTTON */}
        <button
          onClick={onRemove}
          className="
            px-3 py-1.5 text-xs font-semibold rounded-lg border 
            border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200
            transition-all shrink-0
          "
        >
          {(item.status === "uploading" || item.status === "verifying" || item.status === "processing") ? "Cancel" : "Remove"}
        </button>
      </div>

      {/* PROGRESS BAR */}
      {(item.status === "uploading" || item.status === "verifying" || item.status === "processing") && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-100 ${
              item.status === "uploading" ? "bg-blue-500" : 
              item.status === "verifying" ? "bg-yellow-400 animate-pulse w-full" : 
              "bg-green-500 animate-pulse w-full"
            }`}
            style={{ width: item.status === "uploading" ? `${progress}%` : '100%' }}
          ></div>
        </div>
      )}

      {/* DOWNLOAD BUTTON */}
      {item.status === "done" && item.resultUrl && (
        <div className="w-full mt-4 flex justify-center">
          <a
            href={item.resultUrl}
            download={item.resultFilename || "converted"}
            className="flex items-center justify-center py-2 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Download Now
          </a>
        </div>
      )}
    </div>
  );
}
