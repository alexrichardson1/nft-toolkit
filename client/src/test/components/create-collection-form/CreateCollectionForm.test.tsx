import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
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

describe("CreateCollectionForm unit tests", () => {
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
    const alert = tree.getByTestId("form-alert");
    const resetButton = tree.getByTestId("reset");
    expect(alert).not.toHaveTextContent("reset");
    fireEvent.click(resetButton);
    expect(alert).toHaveTextContent("reset");
  });

  test("collection name is empty at start", () => {
    const input = tree.getByTestId("collection-name-input");
    expect(input.textContent).toBe("");
  });

  test("collection name changes on change event", () => {
    const input = tree.getByTestId("collection-name-input");
    const changeEvent = createEvent.change(input, {
      target: { value: "test" },
    });
    input.onchange = jest.fn();
    fireEvent(input, changeEvent);
    expect(input.onchange).toHaveBeenCalledWith(changeEvent);
  });

  test("description name is empty at start", () => {
    const input = tree.getByTestId("description-input");
    expect(input.textContent).toBe("");
  });

  test("description changes on change event", () => {
    const input = tree.getByTestId("description-input");
    const changeEvent = createEvent.change(input, {
      target: { value: "test" },
    });
    input.onchange = jest.fn();
    fireEvent(input, changeEvent);
    expect(input.onchange).toHaveBeenCalledWith(changeEvent);
  });

  test("minting price is 0 at start", () => {
    const NUM_INPUT_ROLE = "spinbutton";
    const input = tree.getByRole(NUM_INPUT_ROLE);
    expect(input.outerHTML).toContain('value="0"');
  });

  test("minting price changes on change event", () => {
    const NUM_INPUT_ROLE = "spinbutton";
    const input = tree.getByRole(NUM_INPUT_ROLE);
    const changeEvent = createEvent.change(input, {
      target: { value: "test" },
    });
    input.onchange = jest.fn();
    fireEvent(input, changeEvent);
    expect(input.onchange).toHaveBeenCalledWith(changeEvent);
  });

  test("form submission prevents default event", () => {
    const form = tree.getByTestId("create-form");
    const submitEvent = createEvent.submit(form);
    form.onsubmit = jest.fn();
    fireEvent(form, submitEvent);
    expect(form.onsubmit).toHaveBeenCalledWith(submitEvent);
  });

  test("handleImageDrop is called", () => {
    global.URL.createObjectURL = jest.fn();
    const mockImgFile = new File(["foo"], "testImg", { type: "image/png" });
    const input = tree.getByTestId("img-upload-input");
    const changeEvent = createEvent.change(input, {
      target: { files: [mockImgFile] },
    });
    changeEvent.preventDefault = jest.fn();
    fireEvent(input, changeEvent);
    expect(changeEvent.preventDefault).toHaveBeenCalled();
  });
});
