import { useRouter } from "next/navigation";

export default function LoginPopup({
    setLoginPromptOpen,
}:{
    setLoginPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
}){
    const router = useRouter();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center relative">
            <button
              onClick={() => setLoginPromptOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close login prompt"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Login required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to perform this action
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setLoginPromptOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/auth/login?callbackUrl=/pricing")}
                className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-5 rounded-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
    );
}