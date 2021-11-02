import NetworkProvider from "context/network/NetworkProvider";
import { mount } from "enzyme";

describe("NetworkProvider unit tests", () => {
  afterAll(() => localStorage.clear());

  test("preferred network set in local storage", () => {
    localStorage.setItem("preferred-network", "ethereum");
    expect(mount(<NetworkProvider>Test</NetworkProvider>)).toMatchSnapshot();
  });
});
