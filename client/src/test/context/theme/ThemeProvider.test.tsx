import { Box } from "@mui/system";
import { render } from "@testing-library/react";
import ThemeProvider from "context/theme/ThemeProvider";

describe("ThemeProvider", () => {
  afterAll(() => localStorage.clear());

  test("local storage has dark theme background", () => {
    localStorage.setItem("theme", "dark");
    const box = render(
      <ThemeProvider>
        <Box
          data-testid="test-theme-box"
          component="div"
          sx={{ bgcolor: "background.default" }}></Box>
      </ThemeProvider>
    );
    expect(box.getByTestId("test-theme-box")).toHaveStyle(
      "background: #202124"
    );
  });

  test("local storage has light theme background", () => {
    localStorage.setItem("theme", "light");
    const box = render(
      <ThemeProvider>
        <Box
          data-testid="test-theme-box"
          component="div"
          sx={{ bgcolor: "background.default" }}></Box>
      </ThemeProvider>
    );
    expect(box.getByTestId("test-theme-box")).toHaveStyle(
      "background: #F0F0F0"
    );
  });
});
