import EthereumLogo from "images/ethereum-logo.svg";
import { useEffect, useState } from "react";
import { networks } from "utils/constants";
import NetworkContext from "./NetworkContext";

const DEFAULT_NET = {
  name: "Ethereum",
  icon: EthereumLogo,
  chainId: 0,
};

interface PropsT {
  children: React.ReactNode;
}

const NetworkProvider = (props: PropsT): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState<NetworkT>(DEFAULT_NET);

  const handleNetworkChange = (newNetwork: NetworkT) => {
    localStorage.setItem("preferred-network", newNetwork.name);
    setSelectedNet(newNetwork);
  };

  useEffect(() => {
    const preferredNetName = localStorage.getItem("preferred-network");
    if (preferredNetName) {
      const preferredNet = networks.find(
        (network) => network.name === preferredNetName
      );
      setSelectedNet(preferredNet || DEFAULT_NET);
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
