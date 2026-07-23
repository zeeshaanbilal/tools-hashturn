import Link from "next/link";

export default function SignInButton() {
  return (
    <Link
      href="/auth/login"
      className="text-sm font-semibold text-slate-300 hover:text-white transition-colors mr-4"
    >
      Login
    </Link>
  );
}
