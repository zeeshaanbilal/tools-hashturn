import FacebookIcon from "@/components/assets/FacebookIcon";
import { poppins } from "@/theme/fonts";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpWithFacebook() {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)"); // sm breakpoint in Tailwind
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);

    // Initial check
    setIsMobile(mq.matches);

    // Listen for screen size changes
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  const handleSignUp = async () => {
    await signIn("facebook", { callbackUrl: "/dashboard" });
  };
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      className="min-w-full py-1 sm:py-2 flex justify-center sm:text-lg text-sm items-center cursor-pointer gap-3 text-typography border border-typography hover:border-primary active:border-primary hover:bg-primary active:bg-primary hover:text-base active:text-base rounded-full"
      style={{ fontFamily: poppins.style.fontFamily }}
      onClick={async (e) => {
        e.preventDefault();
        await handleSignUp();
      }}
    >
      <FacebookIcon
        height="32px"
        width="32px"
        isWhite={isMobile ? false : hover ? true : false}
      />
      <span>Sign Up With Facebook</span>
    </button>
  );
}
