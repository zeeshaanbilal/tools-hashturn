// app/auth/verify/page.tsx
import { poppins } from "@/theme/fonts";
import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  return (
    <div className="w-full flex flex-col items-center text-auth-grayed-text sm:px-10">
      <h1
        className="py-5 text-2xl font-medium"
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        Verifying...
      </h1>
      <p className="text-sm">If you are not redirected, please go to the login page.</p>
      
      <Suspense fallback={null}>
        <VerifyClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
// "use client"
// import { poppins } from "@/theme/fonts";
// import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function VerifyPage() {
// 	const params = useSearchParams();

// 	useEffect(() => {
// 		const token = params?.get("token");
// 		const email = params?.get("email");
// 		if (token && email) {
// 			window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
// 		} else {
// 			window.location.href = "/auth/login?verified=0";
// 		}
// 	}, [params]);

// 	return (
//         <div className="w-full flex flex-col items-center text-auth-grayed-text sm:px-10">
//             <h1
//                 className="py-5 text-2xl font-medium"
//                 style={{ fontFamily: poppins.style.fontFamily }}
//             >
//                 Verifying...
//             </h1>
//             <p className="text-sm">If you are not redirected, please go to the login page.</p>
//         </div>
// 	);
// }


