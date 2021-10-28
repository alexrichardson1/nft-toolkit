import Button from "@mui/material/Button";
import { fireEvent, render } from "@testing-library/react";
const testContext = <T,>(
  testName: string,
  Context: React.Context<T>,
  onClick: (value: T) => unknown
): void =>
  test(testName, () => {
    let fn;
    const tree = render(
      <Context.Consumer>
        {(value) => (
          <Button
            data-testid="context-test-btn"
            onClick={() => {
              fn = onClick(value);
            }}>
            Click Me!
          </Button>
        )}
      </Context.Consumer>
    );
    expect(fn).toBeUndefined();
    const button = tree.getByTestId("context-test-btn");
    fireEvent.click(button);
    expect(fn).toBeDefined();
  });

export default testContext;
