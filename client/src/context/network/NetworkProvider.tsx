import { useEffect, useState } from "react";
import { DEFAULT_NET, NETWORKS } from "utils/constants";
import NetworkContext from "./NetworkContext";

const NetworkProvider = (props: ProviderPropsI): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState<NetworkT>(DEFAULT_NET);

  const handleNetworkChange = (newNetwork: NetworkT) => {
    localStorage.setItem("preferred-network", newNetwork.name);
    setSelectedNet(newNetwork);
  };

  useEffect(() => {
    const preferredNetName = localStorage.getItem("preferred-network");
    if (preferredNetName) {
      const preferredNet = NETWORKS.find(
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
