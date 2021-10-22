import { createContext } from "react";

interface ThemeContextI {
  toggleColourMode: () => void;
}

const ThemeContext = createContext<ThemeContextI>({
  toggleColourMode: () => void 0 === 0,
});

export default ThemeContext;
