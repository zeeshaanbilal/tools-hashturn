"use client";

import { useEffect, useRef, useState } from "react";
import { poppins } from "@/theme/fonts";
import { HTMLInputTypeAttribute } from "react";

interface Props {
  placeholder?: string;
  name: string;
  label?: string;
  value: string;
  setValue: (text: string) => void;
  type?: HTMLInputTypeAttribute;
  error: string;
  setError: (text: string) => void;
}

export default function TextBox({
  placeholder = "",
  name,
  label = "",
  value,
  setValue,
  type = "text",
  error,
  setError,
}: Props) {
  const [showError, setShowError] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const HIDE_DURATION = 300; // ms (match tailwind duration-300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);

    // Hide error immediately if the input becomes valid
    if (next && error) {
      setShowError(false);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setError("");
      }, HIDE_DURATION);
    }
  };

  const handleShowError = async () => {
    setShowError(true);
    await new Promise((res) => setTimeout(res, 1900));
    setShowError(false);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setError("");
    }, HIDE_DURATION);
  };

  useEffect(() => {
    if (error.length > 0) {
      handleShowError();
    } else {
      setShowError(false);
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-1 relative">
      {label.length > 0 && (
        <label
          htmlFor={name}
          className="w-full text-sm sm:text-lg text-auth-grayed-text"
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full px-4 py-2 sm:py-3 text-sm sm:text-lg border-[2px] border-auth-btn-secondary rounded-[12px] focus:outline-none text-auth-grayed-text"
      />

      {error && (
        <div
          className={`absolute right-0 top-full mt-1 w-max rounded-md bg-primary px-2 py-1 text-xs text-white shadow-lg
            transition-all duration-300 ease-out
            ${
              showError
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          {error}
          <div className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-primary"></div>
        </div>
      )}
    </div>
  );
}
