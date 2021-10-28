import NetworkContext from "context/network/NetworkContext";
import { DEFAULT_NET, NETWORKS } from "utils/constants";
import testContext from "../ContextTestsHelper";

describe("NetworkContext", () => {
  testContext("initial showSnackbar", NetworkContext, (value) => {
    expect(value.selectedNet === DEFAULT_NET);
    value.setSelectedNet(NETWORKS[1] || DEFAULT_NET);
    expect(value.selectedNet !== DEFAULT_NET);
    return value.setSelectedNet;
  });
});
