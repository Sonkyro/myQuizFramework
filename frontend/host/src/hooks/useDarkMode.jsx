import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [mode, setMode] = useState("auto"); // auto | dark | light
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateMode() {
      if (mode === "auto") {
        setIsDark(mediaQuery.matches);
      } else if (mode === "dark") {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    }

    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, [mode]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [isDark]);

  return [mode, setMode, isDark];
}
