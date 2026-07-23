"use client";

import { changeTheme } from "@/utils/helper";
import { useEffect, useState } from "react";

// import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  //   const { theme, toggleTheme } = useTheme();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "";
    setTheme(current);

    // listen for changes
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") || "";
      setTheme(t);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(()=>{
    changeTheme(theme);
  },[theme])
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: 20,
        padding: 4,
        borderRadius: 12,
        boxShadow: theme === "dark" ? "0 0 0 2px #222" : "0 0 0 2px #eee",
        transition: "box-shadow 0.2s",
      }}
    >
      {theme === "dark" ? (
        <span role="img" aria-label="Light mode">
          🌞
        </span>
      ) : (
        <span role="img" aria-label="Dark mode">
          🌙
        </span>
      )}
    </button>
  );
}
