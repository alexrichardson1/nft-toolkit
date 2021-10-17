import { amber, deepOrange, grey } from "@mui/material/colors";
import { useMemo, useState } from "react";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import ThemeContext from "./ThemeContext";

export const getDesign = (mode: string): ThemeOptions => {
  return mode === "light"
    ? {
        // palette values for light mode
        palette: {
          mode: "light",
          primary: amber,
          divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        },
      }
    : {
        // palette values for dark mode
        palette: {
          mode: "dark",
          primary: deepOrange,
          divider: deepOrange[700],
          background: {
            default: deepOrange[900],
            paper: deepOrange[900],
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
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
