export async function uploadAndTrack(
  blob: Blob,
  originalName: string,
  toolSlug: string,
  userId?: string | null
): Promise<void> {
  let finalUserId = userId;
  if (!finalUserId) {
    try {
      const meRes = await fetch("/api/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        finalUserId = meData.id;
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  }

  if (!finalUserId) {
    console.warn("No userId available, skipping upload");
    return;
  }

  const form = new FormData();
  form.append("file", blob, originalName);
  form.append("userId", finalUserId);
  form.append("toolSlug", toolSlug);

  const uploadRes = await fetch("/api/processed-files/upload", {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    console.error("Upload API failed");
    return;
  }
}

