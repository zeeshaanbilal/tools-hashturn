import { cn } from "@/utils/cn";
import { MouseEvent, ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth = false,
  disabled = false,
  onClick,
  className,
  href,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500/50 hover:-translate-y-0.5 transition-all duration-300",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 shadow-md hover:shadow-lg focus:ring-slate-500/50 hover:-translate-y-0.5 transition-all duration-300",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400 shadow-sm transition-all duration-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  // If href is provided → render as Link
  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </Link>
    );
  }

  // Otherwise → normal button
  return (
    <button
      onClick={onClick}
      className={classes}
      type={type}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
}
