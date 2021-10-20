import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useContext } from "react";
import { getNetworkFromName, networks } from "common/constants";
import NetworkContext from "context/network/NetworkContext";

const containerStyle = {
  height: 60,
  width: 60,
};

const NETWORK_DIMENSIONS = "70%";

const actions = networks(NETWORK_DIMENSIONS);

const mainFabStyle = {
  border: "3px solid",
  bgcolor: "background.default",
  borderColor: "primary.main",
  "&:hover": {
    borderColor: "secondary.main",
  },
};

const getSmallFabStyle = (network: NetworksT, selectedNetwork?: NetworksT) => {
  if (!selectedNetwork || selectedNetwork.name !== network.name) {
    return { background: "white" };
  }
  return {
    border: "3px solid",
    background: "white",
    borderColor: "primary.main",
  };
};

const NetworkSpeedDial = (): JSX.Element => {
  const { selectedNet, setSelectedNet } = useContext(NetworkContext);
  const selectedNetwork = getNetworkFromName(selectedNet, NETWORK_DIMENSIONS);
  return (
    <Box sx={containerStyle}>
      <SpeedDial
        ariaLabel="network selection"
        direction="down"
        FabProps={{ sx: mainFabStyle }}
        icon={
          selectedNetwork ? selectedNetwork.icon : <AccountBalanceWalletIcon />
        }>
        {actions.map((network) => (
          <SpeedDialAction
            FabProps={{ sx: getSmallFabStyle(network, selectedNetwork) }}
            key={network.name}
            icon={network.icon}
            tooltipTitle={network.name}
            onClick={() => setSelectedNet(network.name)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default NetworkSpeedDial;
