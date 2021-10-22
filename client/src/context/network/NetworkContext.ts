import { createContext } from "react";
import { DEFAULT_NET } from "utils/constants";

interface NetworkContextI {
  selectedNet: NetworkT;
  setSelectedNet: (newNetwork: NetworkT) => void;
}

const NetworkContext = createContext<NetworkContextI>({
  selectedNet: DEFAULT_NET,
  setSelectedNet: (newNetwork: NetworkT) => void newNetwork === newNetwork,
});

export default NetworkContext;
