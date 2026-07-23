"use client";
import { useState } from "react";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthContainer() {
  const [tab, setTab] = useState("login");

  return (
    <div className="w-full sm:w-[600px] sm:rounded-[24px] sm:h-auto h-full py-10 sm:px-10 px-5 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl relative z-10">
      <div className="relative w-full h-full">
        <AuthHeader tab={tab} setTab={setTab} />
        {tab === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
