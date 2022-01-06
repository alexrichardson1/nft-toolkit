import SvgLogo from "components/common/SvgLogo";
import { mount } from "enzyme";
import AvalancheLogo from "images/avalanche-logo.svg";

test("SvgLogo snapshot", () => {
  const tree = mount(
    <SvgLogo alt="test" icon={AvalancheLogo} width="50" height="50" />
  );
  expect(tree).toMatchSnapshot();
});
