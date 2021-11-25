import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import OrderableListItem from "components/common/OrderableListItem";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("OrderableListItem snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <OrderableListItem
        handleLayerRemoval={jest.fn()}
        layerName="test-layer"
        id="test-id"
      />
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

describe("OrderableListItemTests", () => {
  let tree: RenderResult<typeof Queries, HTMLElement>;
  let handleLayerRemoval: jest.Mock<unknown, unknown[]>;
  beforeEach(() => {
    handleLayerRemoval = jest.fn();
    tree = render(
      <ThemeProvider>
        <OrderableListItem
          handleLayerRemoval={handleLayerRemoval}
          layerName="test-layer"
          id="test-id"
        />
      </ThemeProvider>
    );
  });

  test("handleLayerRemoval is called", () => {
    const deleteBtn = tree.getByTestId("delete-layer-btn");
    fireEvent(deleteBtn, createEvent.click(deleteBtn));
    expect(handleLayerRemoval).toHaveBeenCalledWith("test-id");
  });
});
