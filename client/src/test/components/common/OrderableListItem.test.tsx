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
        handleItemRemoval={jest.fn()}
        itemName="test-layer"
        id="test-id"
      />
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

describe("OrderableListItemTests", () => {
  let tree: RenderResult<typeof Queries, HTMLElement>;
  let handleItemRemoval: jest.Mock<unknown, unknown[]>;
  beforeEach(() => {
    handleItemRemoval = jest.fn();
    tree = render(
      <ThemeProvider>
        <OrderableListItem
          handleItemRemoval={handleItemRemoval}
          itemName="test-layer"
          id="test-id"
        />
      </ThemeProvider>
    );
  });

  test("handleItemRemoval is called", () => {
    const deleteBtn = tree.getByTestId("delete-item-btn");
    fireEvent(deleteBtn, createEvent.click(deleteBtn));
    expect(handleItemRemoval).toHaveBeenCalledWith("test-id");
  });
});
