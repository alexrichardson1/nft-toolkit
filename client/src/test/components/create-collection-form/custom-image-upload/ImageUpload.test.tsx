import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import { DAppProvider } from "@usedapp/core";
import ImageUpload from "components/create-collection-form/custom-image-upload/ImageUpload";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("ImageUpload snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <ImageUpload imgObjs={[]} handleImageDrop={jest.fn()} />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

describe("ImageUpload unit tests", () => {
  let tree: RenderResult<typeof Queries, HTMLElement>;
  let mockHandleImageDrop: jest.Mock<unknown, unknown[]>;
  const mockImgObj = {
    url: "testUrl",
    name: "testName",
    id: "testName.png3",
    image: new File(["foo"], "testImg", { type: "image/png" }),
  };

  beforeEach(() => {
    mockHandleImageDrop = jest.fn();
    tree = render(
      <ThemeProvider>
        <NetworkProvider>
          <DAppProvider config={{}}>
            <ImageUpload
              imgObjs={[mockImgObj]}
              handleImageDrop={mockHandleImageDrop}
            />
          </DAppProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("ImageUpload only accepts image MIME types", () => {
    const input = tree.getByTestId("img-upload-input");
    expect(input).toHaveAttribute("accept", "image/*");
  });

  test("handleImageDrop is called on input change", () => {
    const input = tree.getByTestId("img-upload-input");
    const changeEvent = createEvent.change(input, {
      target: { files: [] },
    });
    fireEvent(input, changeEvent);
    expect(mockHandleImageDrop).toHaveBeenCalled();
  });

  test("dragEnter event prevents default", () => {
    const mockPreventDefault = jest.fn();
    const label = tree.getByTestId("img-upload-label");
    const dragEnterEvent = createEvent.dragEnter(label);
    dragEnterEvent.preventDefault = mockPreventDefault;
    fireEvent(label, dragEnterEvent);
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test("dragOver event prevents default", () => {
    const mockPreventDefault = jest.fn();
    const label = tree.getByTestId("img-upload-label");
    const dragOverEvent = createEvent.dragOver(label);
    dragOverEvent.preventDefault = mockPreventDefault;
    fireEvent(label, dragOverEvent);
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test("dragLeave event prevents default", () => {
    const mockPreventDefault = jest.fn();
    const label = tree.getByTestId("img-upload-label");
    const dragLeaveEvent = createEvent.dragLeave(label);
    dragLeaveEvent.preventDefault = mockPreventDefault;
    fireEvent(label, dragLeaveEvent);
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test("drop event calls handleImageDrop", () => {
    const label = tree.getByTestId("img-upload-label");
    const dropEvent = createEvent.drop(label, {
      dataTransfer: { files: [] },
    });
    fireEvent(label, dropEvent);
    expect(mockHandleImageDrop).toHaveBeenCalled();
  });
});
