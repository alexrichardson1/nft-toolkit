import { PaletteMode } from "@mui/material";
import { cyan, pink } from "@mui/material/colors";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import getComponentByMode from "utils/getComponentByMode";
import ThemeContext from "./ThemeContext";

export const getDesign = (mode: PaletteMode): ThemeOptions => {
  return mode === "light"
    ? {
        // palette values for light mode
        palette: {
          mode: "light",
          primary: cyan,
          secondary: pink,
          background: {
            default: "#F0F0F0",
          },
        },
      }
    : {
        // palette values for dark mode
        palette: {
          mode: "dark",
          primary: cyan,
          secondary: pink,
          background: {
            paper: "#202144",
            default: "#202124",
          },
        },
      };
};

const ThemeProvider = ({ children }: ProviderPropsI): JSX.Element => {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      const paletteStoredTheme: PaletteMode = storedTheme;
      setMode(paletteStoredTheme);
    }
  }, []);

  const colourMode = useMemo(
    () => ({
      toggleColourMode: () =>
        setMode((prev) => {
          const newTheme = getComponentByMode(prev, "dark", "light");
          localStorage.setItem("theme", newTheme);
          return newTheme;
        }),
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesign(mode)), [mode]);

  return (
    <ThemeContext.Provider value={colourMode}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
