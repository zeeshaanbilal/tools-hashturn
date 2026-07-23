import { Mail, PhoneIcon, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12">
          {/* Brand & Contact Info (Left) */}
          <div className="col-span-1 md:col-span-2 pr-0 md:pr-10">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icon.png" alt="HashTurn logo" width={44} height={44} className="drop-shadow-md" />
              <h3 className="text-2xl font-bold text-white tracking-wide">HASHTURN</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              We build modern solutions tailored to your business needs, helping you streamline workflows and scale effectively.
            </p>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p>Office No 43/43A City Tower<br/>Chungi No 9, Multan, Pakistan</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon size={18} className="text-blue-500 shrink-0" />
                <a href="tel:+923090483683" className="hover:text-white transition-colors">+92 3090483683</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href="mailto:contact@hashturn.com" className=" hover:text-white transition-colors">contact@hashturn.com</a>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="https://www.hashturn.net/work" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="https://www.hashturn.net/about" className="hover:text-white transition-colors">Team</a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Platform</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="/pages/terms" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="/pages/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="https://www.hashturn.net/about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="https://www.hashturn.net/blog" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="https://www.hashturn.net/about" className="hover:text-white transition-colors">Portfolio</a>
              </li>
              <li>
                <a href="https://www.hashturn.net/contact" className="hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/hashturn_/"
              aria-label="Instagram"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/hashturn"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="10"
                  x2="8"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="7" r="1" fill="currentColor" />
                <path
                  d="M12 10 v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M12 13 q2-2 4 0 v3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/hashturnofficial/"
              aria-label="Facebook"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 9h3V6h-3a4 4 0 00-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3a1 1 0 011-1z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="/rss.xml"
              aria-label="RSS"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 11a9 9 0 019 9M4 6a14 14 0 0114 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="6" cy="18" r="2" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://github.com/hashturn/"
              aria-label="GitHub"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12a10.001 10.001 0 006.839 9.488c.5.091.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.004.07 1.532 1.031 1.532 1.031.892 1.528 2.341 1.086 2.91.831.091-.647.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.56 9.56 0 012.504.337c1.909-1.294 2.748-1.025 2.748-1.025.545 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.935.359.31.679.921.679 1.855 0 1.337-.012 2.417-.012 2.744 0 .267.18.577.688.479A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://medium.com/@hashturnofficial"
              aria-label="Medium"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth={"2"}
                />
                <text
                  x="50%"
                  y="50%"
                  fill="currentColor"
                  fontFamily="Georgia, serif"
                  fontWeight="bold"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  M
                </text>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
