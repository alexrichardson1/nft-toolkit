import SvgLogo from "components/common/SvgLogo";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";
import AvalancheLogo from "images/avalanche-logo.svg";

test("SvgLogo snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <SvgLogo icon={AvalancheLogo} width={"50"} height={"50"} />
  );

  expect(toJson(tree)).toMatchSnapshot();
});
