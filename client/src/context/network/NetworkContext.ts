import { createContext } from "react";

interface NetworkContextT {
  selectedNet: string;
  setSelectedNet: React.Dispatch<React.SetStateAction<string>>;
}

const NetworkContext = createContext({} as NetworkContextT);

export default NetworkContext;
