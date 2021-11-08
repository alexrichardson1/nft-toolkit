import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import { Web3ReactProvider } from "@web3-react/core";
import Tabs from "components/create-collection-form/tabs/Tabs";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("Tabs snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Tabs
            imgObjs={[]}
            handleImageDelete={() => console.log("Image deleted during test")}
            handleNameChange={() => console.log("Name changed during test")}
          />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

describe("Tabs unit tests", () => {
  let mockHandleImageDelete: jest.Mock<unknown>;
  let mockHandleNameChange: jest.Mock<unknown>;
  let tree: RenderResult<typeof Queries, HTMLElement>;

  const mockImgObj1 = {
    url: "testUrl",
    name: "testName",
    id: "testName.png",
    image: new File([""], "testImg", { type: "image/png" }),
  };
  const mockImgObj2 = {
    url: "testUrl",
    name: "testName",
    id: "testName2.png",
    image: new File([""], "testImg", { type: "image/png" }),
  };

  beforeEach(() => {
    mockHandleImageDelete = jest.fn();
    mockHandleNameChange = jest.fn();
    tree = render(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Tabs
              imgObjs={[mockImgObj1, mockImgObj2]}
              handleImageDelete={mockHandleImageDelete}
              handleNameChange={mockHandleNameChange}
            />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("New name of image is updated", () => {
    const input = tree.getByTestId("nft-name-input");
    const changeEvent = createEvent.change(input, {
      target: { value: "something" },
    });
    fireEvent(input, changeEvent);
    expect(mockHandleNameChange).toBeCalled();
  });

  test("Deletion button calls the correct function", () => {
    const deleteButton = tree.getByTestId("delete-icon");
    const clickEvent = createEvent.click(deleteButton);
    clickEvent.preventDefault = jest.fn();
    fireEvent(deleteButton, clickEvent);
    expect(mockHandleImageDelete).toBeCalled();
  });

  test("Tabs change sets a new value", () => {
    const [, image2Tab] = tree.getAllByRole("tab");
    if (image2Tab) {
      const clickEvent = createEvent.click(image2Tab);
      clickEvent.preventDefault = jest.fn();
      fireEvent(image2Tab, clickEvent);
      expect(clickEvent.preventDefault).toHaveBeenCalled();
    } else {
      fail("There should atleast be 2 test images!");
    }
  });
});
