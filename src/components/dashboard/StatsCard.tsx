"use client";

import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardData {
  documentsProcessed: number;
  toolsUsed: number;
  storageUsed: number;
  subscriptionPlan: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default function StatsCards() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const dashboardData = await res.json();
          setData({
            documentsProcessed: dashboardData.documentsProcessed,
            toolsUsed: dashboardData.toolsUsed,
            storageUsed: dashboardData.storageUsed,
            subscriptionPlan: dashboardData.subscriptionPlan || "Free",
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Documents Processed",
      value: loading
        ? "Loading..."
        : `${data?.documentsProcessed || 0} this month`,
    },
    {
      title: "Tools Used",
      value: loading ? "Loading..." : `${data?.toolsUsed || 0} tools`,
    },
    {
      title: "Storage Used",
      value: loading
        ? "Loading..."
        : formatBytes(data?.storageUsed || 0),
    },
    {
      title: "Subscription Plan",
      value: loading ? "Loading..." : data?.subscriptionPlan || "Free",
    },
  ];

  return (
    <div
      className="
          grid grid-cols-4 gap-6 mt-4 mb-8
          max-md:grid-cols-2 max-lg:gap-4
          max-sm:grid-cols-1
        "
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="
              border-2 border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center text-center
              max-sm:p-4
            "
        >
          <div className="bg-red-500/10 p-3 rounded-lg mb-3">
            <FileIcon size={22} className="text-red-500" />
          </div>

          <p className="text-sm font-medium whitespace-nowrap">{card.title}</p>
          <p className="text-xs font-medium mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
  