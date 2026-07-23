"use client";

import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoginPopup from "../popups/LoginPopup";

export default function GenerateTokenButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);


  // useEffect(() => {
  //   async function loadToken() {
  //     const res = await fetch("/api/token/get", { method: "GET" });
  //     if (!res.ok) return;

  //     const data = await res.json();
  //     if (data?.token) setToken(data.token);
  //   }
  //   loadToken();
  // }, []);

  async function handleGenerate() {
    try {
      if (status !== "loading" && !session) {
        setLoginPromptOpen(true);
        return;
      }
      setLoading(true);

      const res = await fetch("/api/token/generate", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to generate token");
        return;
      }

      toast.success("API key generated");
      setToken(data.token);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    try {
      setRegenerating(true);

      const res = await fetch("/api/token/regenerate", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to regenerate token");
        return;
      }

      toast.success("API key regenerated");
      setToken(data.token);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRegenerating(false);
    }
  }

  async function copyToken() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard");
  }

  if (token) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <div
          onClick={copyToken}
          className="w-full max-w-[350px] rounded-lg border bg-gray-100 p-3 
                     font-mono text-sm overflow-x-auto cursor-pointer
                     whitespace-nowrap hover:bg-gray-200 transition"
          title="Click to copy token"
        >
          {token}
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="cursor-pointer text-sm font-semibold px-4 py-2 
                     text-light bg-black text-white rounded-lg 
                     active:bg-gray-800 flex items-center gap-2 w-fit"
        >
          {regenerating ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            "Regenerate Token"
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      {loginPromptOpen && (
          <LoginPopup
            setLoginPromptOpen={setLoginPromptOpen}
          />
      )}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="cursor-pointer text-sm font-semibold px-4 py-2 
                  text-light bg-primary rounded-lg 
                  active:bg-nav-text-btn-hover-color 
                  flex items-center gap-2"
      >
        {loading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate API Key"
        )}
      </button>
    </div>
  );
}
