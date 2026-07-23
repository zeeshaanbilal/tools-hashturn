import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type CardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  iconWrapperClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function Card({
  title,
  description,
  icon,
  href,
  onClick,
  className,
  iconWrapperClassName,
  titleClassName,
  descriptionClassName,
}: CardProps) {
  const Container: any = href ? "a" : "button";

  return (
    <Container
    href={href}
    onClick={onClick}
    className={cn(
        "cursor-pointer w-full text-left flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50",
        "hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300",
        "p-6 group",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        className
    )}
    >

      {icon && (
        <div
          className={cn(
            "mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
            iconWrapperClassName || "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
          )}
        >
          {icon}
        </div>
      )}
      <h3 className={cn("text-lg md:text-xl font-bold text-slate-800 mb-2 transition-colors group-hover:text-blue-600", titleClassName)}>
        {title}
      </h3>
      {description && (
        <p className={cn("text-sm text-slate-500 leading-relaxed", descriptionClassName)}>
          {description}
        </p>
      )}
    </Container>
  );
}


