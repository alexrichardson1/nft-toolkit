import { useEffect, useState } from "react";
import NetworkContext from "./NetworkContext";
import { networks } from "utils/constants";
import EthereumLogo from "images/ethereum-logo.svg";

interface PropsT {
  children: React.ReactNode;
}

const NetworkProvider = (props: PropsT): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState<NetworkT>({
    name: "Ethereum",
    icon: EthereumLogo,
    chainId: 0,
  });

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setSelectedNet(preferredNet!);
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
