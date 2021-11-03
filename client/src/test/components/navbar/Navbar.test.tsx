import Navbar from "components/navbar/Navbar";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount, ReactWrapper } from "enzyme";

// jest.mock("components/navbar/navbarUtils", () => ({
//   connectWallet: jest.fn(),
//   getAccountString: jest.fn(),
// }));

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
          <Navbar />
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
    localStorage.clear();
  });
});
