import Image from "next/image";
import Link from "next/link";

interface props {
  justIcon?: boolean;
  width?: string;
  height?: string;
  baseTextSize?: string;
  mediumTextSize?: string;
  subTitleTextSize?: string;
}

export default function Logo({
  justIcon = false,
  width = "40px",
  height = "40px",
  baseTextSize = "text-xl",
  mediumTextSize = "text-2xl",
  subTitleTextSize = "text-xs",
}: props) {
  return (
    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
      <div className="relative flex items-center justify-center transition-all duration-300">
        <Image
          src={"/icon.png"}
          width={100}
          height={100}
          alt="HashTurn Logo"
          className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          style={{ width: width, height: height }}
        />
      </div>
      {!justIcon && (
        <div className="flex flex-col justify-center">
          <span className={`font-extrabold tracking-tight text-white drop-shadow-sm ${baseTextSize} md:${mediumTextSize}`}>
            HASHTURN
          </span>
        </div>
      )}
    </Link>
  );
}
