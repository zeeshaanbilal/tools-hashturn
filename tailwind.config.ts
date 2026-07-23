module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        typography: "var(--color-typography)",
        base: "var(--color-base)",
        light: "var(--color-light)",
        dark: "var(--color-dark)",
        navTextBtnColor: "var(--color-nav-text-btn-color)",
        navTextBtnHoverColor: "var(--color-nav-text-btn-hover-color)",
        navTextBtnActiveColor: "var(--color-nav-text-btn-active-color)",
        authBtnPrimary: "var(--color-auth-btn-primary)",
        authBtnSecondary: "var(--color-auth-btn-secondary)",
        authGrayedText: "var(--color-auth-grayed-text)",
      },
    },
  },
  plugins: [],
};
