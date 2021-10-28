import Button from "@mui/material/Button";
import { mount } from "enzyme";
const testContext = <T,>(
  testName: string,
  Context: React.Context<T>,
  onClick: (value: T) => unknown
): void =>
  test(testName, () => {
    let fn;
    const tree = mount(
      <Context.Consumer>
        {(value) => (
          <Button
            id="context-test-btn"
            onClick={() => {
              fn = onClick(value);
            }}>
            Click Me!
          </Button>
        )}
      </Context.Consumer>
    );
    expect(fn).toBeUndefined();
    tree.find("#context-test-btn").first().simulate("click");
    expect(fn).toBeDefined();
  });

export default testContext;
