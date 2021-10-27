import { Box } from "@mui/system";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

describe("ThemeProvider", () => {
  test("local storage has dark theme background", () => {
    localStorage.setItem("theme", "dark");
    const box = mount(
      <ThemeProvider>
        <Box
          id="test-theme-box"
          component="div"
          sx={{ bgcolor: "background.default" }}></Box>
      </ThemeProvider>
    );
    expect(box.find("#test-theme-box").last().instance()).toHaveStyle(
      "background: #202124"
    );
  });

  test("local storage has light theme background", () => {
    localStorage.setItem("theme", "light");
    const box = mount(
      <ThemeProvider>
        <Box
          id="test-theme-box"
          component="div"
          sx={{ bgcolor: "background.default" }}></Box>
      </ThemeProvider>
    );
    expect(box.find("#test-theme-box").last().instance()).toHaveStyle(
      "background: #F0F0F0"
    );
  });
});
