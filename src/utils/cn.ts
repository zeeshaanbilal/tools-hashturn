import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
export const formattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
  month: "short", // Aug
  day: "numeric", // 12
  year: "numeric", // 2023
});
}
export const getReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
