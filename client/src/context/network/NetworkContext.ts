import { createContext } from "react";

interface NetworkContextT {
  selectedNet: NetworkT;
  setSelectedNet: (newNetwork: NetworkT) => void;
}

const NetworkContext = createContext({} as NetworkContextT);

export default NetworkContext;
