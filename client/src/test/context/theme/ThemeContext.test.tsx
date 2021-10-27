import Button from "@mui/material/Button";
import ThemeContext from "context/theme/ThemeContext";
import { mount } from "enzyme";

describe("ThemeContext", () => {
  test("initial toggleColourMode", () => {
    let fn;
    const tree = mount(
      <ThemeContext.Consumer>
        {(value) => (
          <Button
            id="context-test-btn"
            onClick={() => {
              fn = value.toggleColourMode;
              value.toggleColourMode();
            }}>
            Click Me!
          </Button>
        )}
      </ThemeContext.Consumer>
    );
    expect(fn).toBeUndefined();
    tree.find("#context-test-btn").first().simulate("click");
    expect(fn).toBeDefined();
  });
});
