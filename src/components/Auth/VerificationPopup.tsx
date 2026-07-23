import { Mail } from "lucide-react";

export default function VerifyEmailModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center relative">
        {/* Close Button (optional) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify your email</h2>
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-6">
          We’ve sent you an email. <br />
          Click the link inside to verify your email.
        </p>
        <button
          onClick={onClose}
          className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
