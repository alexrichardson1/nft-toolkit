import { useState } from "react";
import NetworkContext from "./NetworkContext";

interface PropsT {
  children: React.ReactNode;
}

const NetworkProvider = (props: PropsT): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState("Ethereum");
  return (
    <NetworkContext.Provider value={{ selectedNet, setSelectedNet }}>
      {props.children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
