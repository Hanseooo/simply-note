export function initTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // default = dark
    document.documentElement.classList.add("dark");
  }
}
