import Queries from "@testing-library/dom/types/queries";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import { DAppProvider } from "@usedapp/core";
import CreateCollectionForm from "components/create-collection-form/CreateCollectionForm";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("CreateCollectionForm snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <CreateCollectionForm />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

describe("Test CreateCollectionForm", () => {
  let tree: RenderResult<typeof Queries, HTMLElement>;

  beforeEach(() => {
    tree = render(
      <ThemeProvider>
        <NetworkProvider>
          <DAppProvider config={{}}>
            <CreateCollectionForm />
          </DAppProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("alert has text when reset button clicked", () => {
    const alert = tree.getByTestId("formAlert");
    const resetButton = tree.getByTestId("reset");
    expect(alert).not.toHaveTextContent("reset");
    fireEvent.click(resetButton);
    expect(alert).toHaveTextContent("reset");
  });
});
