import DropZone from "./DropZone";

interface UploadContainerProps {
  isDragging: boolean;
  handlers: {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export default function UploadContainer({
  isDragging,
  handlers,
}: UploadContainerProps) {
  return (
    <div className="w-full max-w-3xl h-[320px] p-1 relative rounded-2xl group transition-transform hover:scale-[1.01] duration-300">
      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <DropZone isDragging={isDragging} {...handlers} />
      </div>
    </div>
  );
}
