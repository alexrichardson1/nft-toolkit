import { createContext } from "react";

interface NetworkContextT {
  selectedNet: string;
  setSelectedNet: (newNetwork: string) => void;
}

const NetworkContext = createContext({} as NetworkContextT);

export default NetworkContext;
