import getComponentByMode from "utils/getComponentByMode";

describe("test getComponentByMode", () => {
  const LIGHT_MODE = "light";
  const DARK_MODE = "dark";

  test("light mode test", () => {
    expect(getComponentByMode(LIGHT_MODE, "light", "dark")).toBe("light");
  });

  test("dark mode test", () => {
    expect(getComponentByMode(DARK_MODE, "light", "dark")).toBe("dark");
  });
});
