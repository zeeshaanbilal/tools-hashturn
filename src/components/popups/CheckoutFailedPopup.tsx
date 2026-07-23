export default function CheckoutFailedPopup({
  setCheckoutFailedOpen,
  message = "We couldn't start checkout. Please try again in a moment.",
}: {
  setCheckoutFailedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center relative">
        <button
          onClick={() => setCheckoutFailedOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close checkout error"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Checkout failed
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setCheckoutFailedOpen(false)}
            className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
