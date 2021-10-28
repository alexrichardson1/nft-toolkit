import { DAppProvider } from "@usedapp/core";
import Navbar from "components/Navbar";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount, ReactWrapper } from "enzyme";

describe("Navbar tests", () => {
  let tree: ReactWrapper<
    unknown,
    Readonly<unknown>,
    React.Component<unknown, unknown, unknown>
  >;

  beforeAll(() => {
    tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <DAppProvider config={{}}>
            <Navbar />
          </DAppProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("Navbar snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  test("Theme is toggled on toggle press", () => {
    localStorage.setItem("theme", "light");
    tree.find("#theme-change-btn").first().simulate("click");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
