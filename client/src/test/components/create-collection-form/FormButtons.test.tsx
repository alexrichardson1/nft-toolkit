import FormButtons from "components/create-collection-form/FormButtons";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

describe("FormButtons snapshot", () => {
  test("isLastStep snapshot", () => {
    const tree = mount(
      <ThemeProvider>
        <FormButtons
          stepNumber={0}
          isLastStep={true}
          isLoading={false}
          loadingMessage="test"
          handlePrevStep={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("isLoading snapshot", () => {
    const tree = mount(
      <ThemeProvider>
        <FormButtons
          stepNumber={0}
          isLastStep={false}
          isLoading={true}
          loadingMessage="test"
          handlePrevStep={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("general snapshot", () => {
    const tree = mount(
      <ThemeProvider>
        <FormButtons
          stepNumber={0}
          isLastStep={false}
          isLoading={false}
          loadingMessage="test"
          handlePrevStep={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
