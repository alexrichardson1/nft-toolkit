import { useEffect, useState } from "react";
import NetworkContext from "./NetworkContext";

interface PropsT {
  children: React.ReactNode;
}

const NetworkProvider = (props: PropsT): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState("Ethereum");

  const handleNetworkChange = (newNetwork: string) => {
    localStorage.setItem("preferred-network", newNetwork);
    setSelectedNet(newNetwork);
  };

  useEffect(() => {
    const preferredNet = localStorage.getItem("preferred-network");
    if (preferredNet) {
      setSelectedNet(preferredNet);
    }
  }, []);

  return (
    <NetworkContext.Provider
      value={{ selectedNet, setSelectedNet: handleNetworkChange }}>
      {props.children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
