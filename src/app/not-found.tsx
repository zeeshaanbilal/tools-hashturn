import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          <div className="text-center md:text-left">
            <h1 className="text-[104pt] font-normal text-gray-700">404</h1>
            <h2 className="text-4xl font-semibold text-gray-700 mt-2">
              Page not found
            </h2>
            <p className="text-gray-500 mt-2">
              The page you are looking for doesn't exist.
            </p>
  
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Go back home
            </Link>
          </div>
  
          <div className="relative w-fit mx-auto">
            <div className="w-60 md:w-80">
                <img
                src="/404-illustration.png"
                alt="Not found"
                className="w-full"
                />
            </div>
            <div className="absolute top-4 -left-2 flex flex-col gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="absolute top-45 -left-8 flex flex-col gap-2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <div className="absolute bottom-10 left-8 flex flex-col gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
        </div>

        </div>
      </div>
    );
  }
  