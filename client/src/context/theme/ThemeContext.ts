import { createContext } from "react";

interface ThemeContextT {
  toggleColourMode: () => void;
}

const ThemeContext = createContext({} as ThemeContextT);

export default ThemeContext;
