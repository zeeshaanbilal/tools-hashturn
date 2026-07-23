"use client";
import { create } from "zustand";
import { uploadAndTrack } from "@/lib/fileUpload";

export type QueueItemStatus = "queued" | "uploading" | "verifying" | "processing" | "done" | "error";

export interface QueueItem {
  id: string;
  file: File;
  status: QueueItemStatus;
  error?: string;
  resultUrl?: string;
  resultFilename?: string;
}

interface FileQueueState {
  queue: QueueItem[];
  isProcessing: boolean;
  batchResultUrl?: string;
  batchResultFilename?: string;

  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clear: () => void;

  process: (
    endpoint: string,
    body: Record<string, any>,
    type: string
  ) => Promise<void>;
}

export const useFileQueue = create<FileQueueState>((set, get) => ({
  queue: [],
  isProcessing: false,
  batchResultUrl: undefined,
  batchResultFilename: undefined,

  addFiles: (files) => {
    const items = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "queued" as QueueItemStatus,
    }));
    set((s) => ({ queue: [...s.queue, ...items], batchResultUrl: undefined, batchResultFilename: undefined }));
  },

  removeFile: (id) => {
    set((s) => ({ queue: s.queue.filter((f) => f.id !== id) }));
  },

  clear: () => {
    if (get().isProcessing) return;
    set({ queue: [], batchResultUrl: undefined, batchResultFilename: undefined });
  },

  process: async (endpoint, body, type) => {
    const { queue, isProcessing } = get();
    if (isProcessing) return;

    const isSequential = type?.toLowerCase() === "sequential";
    const items = queue.filter((i) => i.status === "queued");
    if (items.length === 0) return;

    set({ isProcessing: true });

    const toolSlug = endpoint.replace("/api/tools/", "").split("?")[0];

    let userId: string | null = null;
    try {
      const meRes = await fetch("/api/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        userId = meData.id;
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    }

    try {
      // 1. UPLOADING STATE
      set((state) => ({
        queue: state.queue.map((i) =>
          items.some((s) => s.id === i.id)
            ? { ...i, status: "uploading", error: undefined }
            : i
        ),
      }));
      await new Promise((res) => setTimeout(res, 1500));

      // 2. VERIFYING STATE
      set((state) => ({
        queue: state.queue.map((i) =>
          items.some((s) => s.id === i.id)
            ? { ...i, status: "verifying" }
            : i
        ),
      }));
      await new Promise((res) => setTimeout(res, 1000));

      // 3. PROCESSING STATE
      set((state) => ({
        queue: state.queue.map((i) =>
          items.some((s) => s.id === i.id)
            ? { ...i, status: "processing" }
            : i
        ),
      }));

      // =========================
      // SEQUENTIAL MODE
      // =========================
      if (isSequential) {
        for (const item of items) {
          try {
            const form = new FormData();
            form.append("file", item.file);
            Object.entries(body).forEach(([k, v]) =>
              form.append(k, v as any)
            );

            const res = await fetch(endpoint, { method: "POST", body: form });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || "Processing failed");
            }

            const blob = await res.blob();

            await uploadAndTrack(blob, item.file.name.replace(/\.?\w+$/, "") + "-converted", toolSlug, userId);

            const url = URL.createObjectURL(blob);
            const downloadName = item.file.name.replace(/\.?\w+$/, "") + "-converted";

            set((state) => ({
              queue: state.queue.map((i) =>
                i.id === item.id ? { ...i, status: "done", resultUrl: url, resultFilename: downloadName } : i
              ),
            }));
          } catch (err: any) {
            set((state) => ({
              queue: state.queue.map((i) =>
                i.id === item.id
                  ? { ...i, status: "error", error: err.message }
                  : i
              ),
            }));
          }
        }

        set({ isProcessing: false });
        return;
      }

      // =========================
      // BATCH MODE
      // =========================
      const form = new FormData();
      items.forEach((i) => form.append("files", i.file));
      Object.entries(body).forEach(([k, v]) =>
        form.append(k, v as any)
      );

      const res = await fetch(endpoint, { method: "POST", body: form });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Batch processing failed");
      }

      const blob = await res.blob();

      await uploadAndTrack(blob, "converted", toolSlug, userId);

      const url = URL.createObjectURL(blob);
      const downloadName = "converted.pdf";

      set((state) => ({
        batchResultUrl: url,
        batchResultFilename: downloadName,
        queue: state.queue.map((i) =>
          items.some((s) => s.id === i.id)
            ? { ...i, status: "done" } // No resultUrl for individual items
            : i
        ),
      }));
    } catch (err: any) {
      set((state) => ({
        queue: state.queue.map((i) =>
          items.some((s) => s.id === i.id)
            ? { ...i, status: "error", error: err.message }
            : i
        ),
      }));
    } finally {
      set({ isProcessing: false });
    }
  },
}));
