import { cyan, deepOrange, pink, teal } from "@mui/material/colors";
import { useEffect, useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { getComponentByMode } from "utils/getComponentByMode";
import { PaletteMode } from "@mui/material";

export const getDesign = (mode: string): ThemeOptions => {
  return mode === "light"
    ? {
        // palette values for light mode
        palette: {
          mode: "light",
          primary: pink,
          secondary: deepOrange,
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
          secondary: teal,
          background: {
            paper: "#202144",
            default: "#202124",
          },
        },
      };
};

interface PropsT {
  children: React.ReactNode;
}

const ThemeProvider = (props: PropsT): JSX.Element => {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setMode(storedTheme as PaletteMode);
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
      <MUIThemeProvider theme={theme}>{props.children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
