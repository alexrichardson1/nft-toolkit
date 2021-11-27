import OrderableList from "components/common/OrderableList";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("OrderableListItem snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <OrderableList
        handleItemReorder={jest.fn()}
        items={[
          {
            images: {},
            name: "test-name",
            numberOfImages: 0,
          },
        ]}>
        child1
      </OrderableList>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
