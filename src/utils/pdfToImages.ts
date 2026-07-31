import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

// Setup worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;
}

export async function convertPdfToImagesZip(file: File, onProgress: (msg: string) => void): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  onProgress("Loading PDF...");
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  
  const zip = new JSZip();
  
  for (let i = 1; i <= numPages; i++) {
    onProgress(`Converting page ${i} of ${numPages}...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if(!ctx) throw new Error("Could not create canvas context");
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    
    // Convert to PNG blob
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) {
      zip.file(`page_${i}.png`, blob);
    }
  }
  
  onProgress("Creating Zip file...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}
