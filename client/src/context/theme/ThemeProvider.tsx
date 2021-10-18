import { cyan, deepOrange, pink, teal } from "@mui/material/colors";
import { useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

export const getDesign = (mode: string): ThemeOptions => {
  return mode === "light"
    ? {
        // palette values for light mode
        palette: {
          mode: "light",
          primary: pink,
          secondary: deepOrange,
        },
      }
    : {
        // palette values for dark mode
        palette: {
          mode: "dark",
          primary: cyan,
          secondary: teal,
        },
      };
};

interface PropsT {
  children: React.ReactNode;
}

const ThemeProvider = (props: PropsT): JSX.Element => {
  const [mode, setMode] = useState("light");
  const colourMode = useMemo(
    () => ({
      toggleColourMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
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
