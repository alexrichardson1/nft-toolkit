import { DAppProvider } from "@usedapp/core";
import CreateCollectionForm from "components/create-collection-form/CreateCollectionForm";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount, ReactWrapper } from "enzyme";

let tree: ReactWrapper<
  unknown,
  Readonly<unknown>,
  React.Component<unknown, unknown, unknown>
>;

describe("Test CreateCollectionForm", () => {
  beforeAll(() => {
    tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <DAppProvider config={{}}>
            <CreateCollectionForm />
          </DAppProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("CreateCollectionForm snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  test("alert is initially empty", () => {
    const alert = tree.find("#formAlert").at(0);
    expect(alert.text().length).toEqual(0);
  });

  test("alert has text when reset button clicked", () => {
    const alert = tree.find("#formAlert").at(0);
    const resetButton = tree.find("#reset").at(0);
    resetButton.simulate("click");
    expect(alert.text().length).toBeGreaterThan(0);
  });
});
