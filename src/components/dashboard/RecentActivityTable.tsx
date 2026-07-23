"use client";

import { getExtension } from "@/utils/helper";
import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RecentActivityItem {
  id: string;
  fileName: string;
  fileType: string;
  tool: string;
  date: string;
  status: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RecentActivityTable() {
  const [items, setItems] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setItems(data.recentActivity || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 w-full">
        <h3 className="text-gray-900 font-semibold mb-4">Recent Activity</h3>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 w-full">
        <h3 className="text-gray-900 font-semibold mb-4">Recent Activity</h3>
        <p className="text-sm text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <h3 className="text-gray-900 font-semibold mb-4">Recent Activity</h3>

      {/* DESKTOP TABLE */}
      <table className="w-full text-sm max-sm:hidden">
        <thead>
          <tr className="text-gray-500 border-b-2 border-gray-100">
            <th className="py-2 text-left">File</th>
            <th className="py-2 text-left">Tool</th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Status</th>
            <th className="py-2 text-left">Download</th>
          </tr>
        </thead>

        <tbody>
          {items.map((row, i) => (
            <tr key={i} className="border-b-2 border-gray-100">
              <td className="py-3 flex items-center gap-2">
                <Image src="/fileIcon.png" width={20} height={20} alt="file" />
                {row.fileName}
              </td>
              <td className="py-3">{row.tool}</td>
              <td className="py-3">{formatDate(row.date)}</td>
              <td className="py-3 capitalize">{row.status}</td>
              <td className="py-3">
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = `/api/download/${row.id}`;
                    a.download = `${row.fileName}${getExtension(row.fileType)}`;
                    a.click();
                  }}
                  className="text-gray-600 cursor-pointer hover:text-black"
                >
                  <Download size={16} />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MOBILE CARD LIST */}
      <div className="hidden max-sm:block space-y-3">
        {items.map((row, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Image src="/fileIcon.png" width={18} height={18} alt="file" />
              {row.fileName}
            </div>

            <p className="text-xs text-gray-600">Tool: {row.tool}</p>
            <p className="text-xs text-gray-600">Date: {formatDate(row.date)}</p>
            <p className="text-xs text-gray-600">Status: {row.status}</p>

            <div className="flex justify-end pt-1">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/download/${row.id}`);
                    if (res.ok) {
                      const { url } = await res.json();
                      window.open(url, "_blank");
                    } else {
                      console.error("Failed to get download URL");
                    }
                  } catch (error) {
                    console.error("Error downloading file:", error);
                  }
                }}
                className="text-gray-600 hover:text-black"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
