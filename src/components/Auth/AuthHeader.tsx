import { avenir_roman } from "@/theme/fonts";

interface props {
  tab: string;
  setTab: (tab: string) => void;
}

export default function AuthHeader({ tab, setTab }: props) {
  return (
    <div
      className="w-full flex font-light gap-3"
      style={{ fontFamily: avenir_roman.style.fontFamily }}
    >
      <div
        className={`w-[50%] flex justify-center items-center cursor-pointer rounded-full py-2 font-medium ${
          tab === "signup" ? "bg-auth-btn-primary text-white" : "bg-auth-btn-secondary text-slate-700"
        } text-base transition-colors`}
        onClick={() => setTab("signup")}
      >
        Sign up
      </div>
      <div
        className={`w-[50%] flex justify-center items-center cursor-pointer rounded-full py-2 font-medium ${
          tab === "login" ? "bg-auth-btn-primary text-white" : "bg-auth-btn-secondary text-slate-700"
        } text-base transition-colors`}
        onClick={() => setTab("login")}
      >
        Login
      </div>
    </div>
  );
}
