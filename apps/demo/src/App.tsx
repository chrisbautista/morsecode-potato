import { useEffect, useState } from "react";
import MorsecodeTranslator from "./MorsecodeTranslator.js";

type Theme = "auto" | "light" | "dark";

const THEME_KEY = "morsecode-theme";
const THEME_LABEL: Record<Theme, string> = {
  auto: "Shift: auto",
  light: "Shift: day",
  dark: "Shift: night",
};
const NEXT_THEME: Record<Theme, Theme> = { auto: "light", light: "dark", dark: "auto" };

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : "auto";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") {
      delete root.dataset.theme;
      localStorage.removeItem(THEME_KEY);
    } else {
      root.dataset.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  return (
    <div className="station">
      <header className="masthead">
        <div>
          <h1>Morsecode Potato</h1>
          <p className="tagline">Telegraph office — est. 2020</p>
        </div>
        <div className="masthead-actions">
          <button
            type="button"
            className="chip"
            title="Switch between day, night, and system theme"
            onClick={() => setTheme(NEXT_THEME[theme])}
          >
            {THEME_LABEL[theme]}
          </button>
          <a className="plaque" href="https://github.com/chrisbautista/morsecode-potato">
            codespud @ github
          </a>
        </div>
      </header>
      <MorsecodeTranslator />
    </div>
  );
}
