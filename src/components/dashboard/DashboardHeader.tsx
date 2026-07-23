"use client";
import { useSession } from "next-auth/react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  return (
    <div className="relative w-full h-[330px] overflow-hidden bg-[#0f172a] rounded-b-[2.5rem] max-md:h-[260px] max-sm:h-[220px]">
      {/* Animated Blobs */}
      <div className="cta-mesh-blob" style={{ width: '400px', height: '400px', background: '#3b82f6', top: '-100px', left: '-100px' }}></div>
      <div className="cta-mesh-blob" style={{ width: '350px', height: '350px', background: '#8b5cf6', top: '50px', right: '-50px', animationDelay: '-4s' }}></div>
      <div className="cta-mesh-blob" style={{ width: '300px', height: '300px', background: '#06b6d4', bottom: '-100px', left: '30%', animationDelay: '-8s' }}></div>
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-[8%] text-white max-sm:px-6">
        <h1 className="text-4xl font-bold mb-3 max-sm:text-3xl tracking-tight">
          Welcome back to HashTurn
        </h1>
        <p className="text-base text-slate-200 max-sm:text-sm max-w-2xl leading-relaxed">
          Manage your PDFs, conversions, and tools from one central place.
        </p>
      </div>
    </div>
  );
}
