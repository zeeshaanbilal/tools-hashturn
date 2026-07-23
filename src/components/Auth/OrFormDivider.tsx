import { avenir_roman } from "@/theme/fonts";

export default function OrFormDivider() {
  return (
    <div className="w-full h-10 flex items-center my-2 sm:my-5">
      <div className={`w-[calc(50%-40px)] bg-auth-btn-secondary h-[1.6px] sm:h-[2px]`}></div>
      <div
        className={`w-[80px] h-10 flex justify-center items-center text-auth-grayed-text text-lg`}
        style={{ fontFamily: avenir_roman.style.fontFamily }}
      >
        OR
      </div>
      <div className={`w-[calc(50%-40px)] bg-auth-btn-secondary h-[1.6px] sm:h-[2px]`}></div>
    </div>
  );
}
