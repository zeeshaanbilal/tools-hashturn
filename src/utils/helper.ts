export const changeTheme = (theme: string) => {
  document.querySelector("html")?.setAttribute("data-theme", theme);
};

export const getExtension = (mime: string) => {
  if (!mime) return "";

  const parts = mime.split("/");
  if (parts.length < 2) return "";

  return `.${parts[1].replace("+xml", "").replace("+json", "")}`;
}