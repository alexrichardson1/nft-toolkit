import ThemeContext from "context/theme/ThemeContext";
import testContext from "../ContextTestsHelper";

describe("ThemeContext", () => {
  testContext("initial toggleColourMode", ThemeContext, (value) => {
    value.toggleColourMode();
    return value.toggleColourMode;
  });
});
