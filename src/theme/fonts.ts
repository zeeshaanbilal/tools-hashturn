import { Inter, Jost, Volkhov, Poppins } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });

export const jost = Jost({ subsets: ["latin"] });

export const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const avenir_roman = localFont({
  src: "../../public/fonts/avenir/AvenirLTStd-Roman.otf",
});
