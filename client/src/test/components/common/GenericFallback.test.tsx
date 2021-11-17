import GenericFallback from "components/common/GenericFallback";
import { mount } from "enzyme";

test("Generic fallback", () => {
  const tree = mount(<GenericFallback error />);
  expect(tree).toMatchSnapshot();
});

test("Generic fallback false", () => {
  const tree = mount(
    <GenericFallback error={false}>
      <div>
        <p>Hello</p>
      </div>
    </GenericFallback>
  );
  expect(tree).toMatchSnapshot();
});
