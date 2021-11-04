import GenericFallback from "components/common/GenericFallback";
import { mount } from "enzyme";

test("Generic fallback", () => {
  const tree = mount(<GenericFallback error />);
  expect(tree).toMatchSnapshot();
});
