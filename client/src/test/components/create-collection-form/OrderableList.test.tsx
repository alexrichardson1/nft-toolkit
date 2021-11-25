import OrderableList from "components/create-collection-form/OrderableList";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("OrderableListItem snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <OrderableList
        handleLayerRemoval={jest.fn()}
        handleLayerReorder={jest.fn()}
        items={[
          {
            layerId: "test-layer",
            images: {},
            name: "test-name",
            numberOfImages: 0,
          },
        ]}
      />
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
