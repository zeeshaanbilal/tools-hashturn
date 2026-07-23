import Image from "next/image";
import AuthRightSection from "../Auth/LoginForm";
import GradientBGPrimary from "../assets/GradientBGPrimary";
import AuthContainer from "../Auth/AuthContainer";

export default function AuthLayout() {
  return (
    <>
      {/* Fixed background with CTA mesh blobs to match pricing cards */}
      <div className="fixed top-0 left-0 w-full h-full bg-white overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-5xl aspect-square opacity-70">
          <div className="cta-mesh-blob cta-mb-1 scale-150"></div>
          <div className="cta-mesh-blob cta-mb-2 scale-150"></div>
          <div className="cta-mesh-blob cta-mb-3 scale-150"></div>
          <div className="cta-mesh-blob cta-mb-4 scale-150"></div>
        </div>
        <div className="cta-mesh-overlay"></div>
      </div>

      {/* Scrollable content overlay */}
      <div className="fixed top-0 left-0 w-full h-full overflow-y-auto">
        <div className="min-h-full flex justify-center items-center py-8">
          <AuthContainer />
        </div>
      </div>
    </>
    // <div className="fixed top-0 left-0 w-screen min-h-screen flex">
    //   <div className="">
    //   <GradientBGPrimary />
    //   </div>
    //   <div className="w-full min-h-screen z-10 flex justify-center items-center">
    //     <AuthContainer />
    //   </div>
    // </div>
  );
}
