export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contact/:path*",
    // "/pdfServices/:path*",
    "/upload/:path*",
    // "/otherServices/:path*",
    // "/pricing/:path*",
  ],
};
