import { createContext } from "react";

interface ThemeContextT {
  toggleColourMode: () => void;
}

const ThemeContext = createContext<ThemeContextT>({
  toggleColourMode: () => void 0 === 0,
});

export default ThemeContext;
