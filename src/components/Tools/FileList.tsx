import { QueueItem } from "@/store/fileQueue";
import FileItem from "./FileItem";

interface FileListProps {
  queue: QueueItem[];
  removeFile: (id: string) => void;
}

export default function FileList({ queue, removeFile }: FileListProps) {
  if (queue.length === 0) return null;

  return (
    <div className="w-full max-w-3xl space-y-4">
      <h3 className="text-gray-900 font-medium px-1">Selected Files</h3>

      {/* Scrollable container */}
      <div
        className="
          border border-gray-200 rounded-lg bg-white 
          max-h-72 overflow-y-auto 
          divide-y divide-gray-100
        "
      >
        {queue.map((item) => (
          <FileItem key={item.id} item={item} onRemove={() => removeFile(item.id)} />
        ))}
      </div>
    </div>
  );
}
